import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WalletController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
