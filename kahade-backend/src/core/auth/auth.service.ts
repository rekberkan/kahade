import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { HashUtil } from '@common/utils/hash.util';
import { IUserResponse } from '@common/interfaces/user.interface';
import { TokenBlacklistService } from './token-blacklist.service';

export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IAuthResponse> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await HashUtil.hash(registerDto.password);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user.id, user.email);

    // SECURITY FIX: Store refresh token in Redis
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.userService.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<IAuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userService.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user.id, user.email);

    // SECURITY FIX: Store refresh token in Redis
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.userService.sanitizeUser(user),
      ...tokens,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await HashUtil.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async refreshToken(refreshToken: string): Promise<ITokenPair> {
    try {
      // SECURITY FIX: Verify token exists in Redis before refresh
      const userId = await this.tokenBlacklistService.validateRefreshToken(refreshToken);
      if (!userId) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      if (payload.sub !== userId) {
        throw new UnauthorizedException('Token mismatch');
      }

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // SECURITY FIX: Revoke old refresh token (rotation)
      await this.tokenBlacklistService.revokeRefreshToken(refreshToken);

      // Generate new token pair
      const tokens = await this.generateTokens(user.id, user.email);

      // Store new refresh token
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, accessToken: string): Promise<{ message: string }> {
    // SECURITY FIX: Blacklist the access token
    const expiresIn = this.configService.get<string>('jwt.expiresIn', '15m');
    const expiresInSeconds = this.parseExpirationToSeconds(expiresIn);
    
    await this.tokenBlacklistService.blacklistToken(accessToken, expiresInSeconds);

    // Note: Refresh token revocation happens on next refresh attempt
    // Or implement full logout with refresh token if provided

    return { message: 'Successfully logged out' };
  }

  private async generateTokens(userId: string, email: string): Promise<ITokenPair> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const expiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
    const expiresInSeconds = this.parseExpirationToSeconds(expiresIn);
    
    await this.tokenBlacklistService.storeRefreshToken(userId, refreshToken, expiresInSeconds);
  }

  private parseExpirationToSeconds(expiration: string): number {
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 900; // 15 minutes default
    }
  }
}
