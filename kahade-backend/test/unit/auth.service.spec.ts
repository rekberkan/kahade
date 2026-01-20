import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@core/auth/auth.service';
import { UserService } from '@core/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from '@core/auth/token-blacklist.service';
import { SessionRepository } from '@core/auth/session.repository';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            updateLastLogin: jest.fn(),
            sanitizeUser: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config: Record<string, any> = {
                'jwt.secret': 'test-secret',
                'jwt.refreshSecret': 'test-refresh-secret',
                'jwt.expiresIn': '15m',
                'jwt.refreshExpiresIn': '7d',
              };
              return config[key] ?? defaultValue;
            }),
          },
        },
        {
          provide: TokenBlacklistService,
          useValue: {
            blacklistToken: jest.fn(),
            revokeRefreshToken: jest.fn(),
            storeRefreshToken: jest.fn(),
            validateRefreshToken: jest.fn(),
          },
        },
        {
          provide: SessionRepository,
          useValue: {
            create: jest.fn(),
            findByToken: jest.fn(),
            revoke: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService) as jest.Mocked<UserService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        name: 'Test User',
        username: 'testuser',
        phone: '+6281234567890',
      };

      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue({
        id: '123',
        email: registerDto.email,
        name: registerDto.name,
      } as any);
      userService.sanitizeUser.mockReturnValue({} as any);
      jwtService.signAsync.mockResolvedValueOnce('access-token');
      jwtService.signAsync.mockResolvedValueOnce('refresh-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken', 'access-token');
      expect(result).toHaveProperty('refreshToken', 'refresh-token');
      expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userService.create).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      userService.findByEmail.mockResolvedValue({ id: '123' } as any);

      await expect(
        service.register({
          email: 'existing@example.com',
          password: 'password',
          name: 'Test',
          username: 'test',
          phone: '+62812',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should successfully login user', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const mockUser = {
        id: '123',
        email: loginDto.email,
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as any);
      userService.sanitizeUser.mockReturnValue({} as any);
      jwtService.signAsync.mockResolvedValueOnce('access-token');
      jwtService.signAsync.mockResolvedValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error for invalid credentials', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});