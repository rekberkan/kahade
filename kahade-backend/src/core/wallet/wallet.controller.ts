import { Controller, Get } from '@nestjs/common';

@Controller('wallet')
export class WalletController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
