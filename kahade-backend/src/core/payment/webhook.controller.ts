import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';

@ApiTags('webhooks')
@Controller('webhook')
export class WebhookController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Public()
  @Post('payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle payment webhooks' })
  async handleWebhook(@Body() payload: any) {
    return { status: 'processed' };
  }
}
