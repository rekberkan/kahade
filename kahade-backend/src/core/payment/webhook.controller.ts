import { Controller, Get } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
