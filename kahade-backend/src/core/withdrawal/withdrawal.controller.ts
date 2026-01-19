import { Controller, Get } from '@nestjs/common';

@Controller('withdrawal')
export class WithdrawalController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
