import { Controller, Get } from '@nestjs/common';

@Controller('xendit')
export class XenditController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
