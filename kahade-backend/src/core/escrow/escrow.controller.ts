import { Controller, Get } from '@nestjs/common';

@Controller('escrow')
export class EscrowController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
