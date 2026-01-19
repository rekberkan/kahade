import { Controller, Get } from '@nestjs/common';

@Controller('kyc')
export class KycController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
