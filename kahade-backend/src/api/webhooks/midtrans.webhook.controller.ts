import { Controller, Get } from '@nestjs/common';

@Controller('midtrans')
export class MidtransController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
