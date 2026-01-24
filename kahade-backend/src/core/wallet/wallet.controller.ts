import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { WalletService } from './wallet.service';
import { TopUpDto } from './dto/topup.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Returns wallet balance' })
  async getBalance(@CurrentUser('id') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTransactions(
    @CurrentUser('id') userId: string,
    @Query('type') type?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.walletService.getTransactions(userId, { type, page, limit });
  }

  @Post('topup')
  @ApiOperation({ summary: 'Top up wallet balance' })
  @ApiResponse({ status: 201, description: 'Top up initiated' })
  async topUp(
    @CurrentUser('id') userId: string,
    @Body() topUpDto: TopUpDto,
  ) {
    return this.walletService.topUp(userId, topUpDto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw from wallet' })
  @ApiResponse({ status: 201, description: 'Withdrawal initiated' })
  async withdraw(
    @CurrentUser('id') userId: string,
    @Body() withdrawDto: WithdrawDto,
  ) {
    return this.walletService.withdraw(userId, withdrawDto);
  }

  @Get('banks')
  @ApiOperation({ summary: 'Get list of supported banks' })
  @ApiResponse({ status: 200, description: 'Returns list of banks' })
  async getBanks() {
    return this.walletService.getSupportedBanks();
  }
}
