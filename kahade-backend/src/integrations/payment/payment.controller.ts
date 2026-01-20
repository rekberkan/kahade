import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Public } from '@common/decorators/public.decorator';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('callback')
  @ApiOperation({ summary: 'Payment gateway callback' })
  @ApiResponse({ status: 200, description: 'Callback processed' })
  async handleCallback(@Body() payload: any) {
    // Handle payment gateway callback
    return { message: 'Callback received', data: payload };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('verify/:paymentId')
  @ApiOperation({ summary: 'Verify payment status' })
  @ApiResponse({ status: 200, description: 'Payment verification result' })
  async verifyPayment(@Param('paymentId') paymentId: string) {
    return this.paymentService.verifyPayment(paymentId);
  }
}
