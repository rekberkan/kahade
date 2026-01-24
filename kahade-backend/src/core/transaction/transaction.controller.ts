import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create new escrow transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.create(userId, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('role') role?: string,
  ) {
    return this.transactionService.findAllByUser(userId, { page, limit, status, role });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Returns transaction' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactionService.findOne(id, userId);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept transaction invitation' })
  @ApiResponse({ status: 200, description: 'Transaction accepted' })
  async accept(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactionService.accept(id, userId);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject transaction invitation' })
  @ApiResponse({ status: 200, description: 'Transaction rejected' })
  async reject(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.transactionService.reject(id, userId, reason);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Pay for transaction (buyer)' })
  @ApiResponse({ status: 200, description: 'Payment initiated' })
  async pay(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactionService.pay(id, userId);
  }

  @Post(':id/confirm-delivery')
  @ApiOperation({ summary: 'Confirm delivery (seller)' })
  @ApiResponse({ status: 200, description: 'Delivery confirmed' })
  async confirmDelivery(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactionService.confirmDelivery(id, userId);
  }

  @Post(':id/confirm-receipt')
  @ApiOperation({ summary: 'Confirm receipt and release funds (buyer)' })
  @ApiResponse({ status: 200, description: 'Receipt confirmed, funds released' })
  async confirmReceipt(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.transactionService.confirmReceipt(id, userId);
  }

  @Post(':id/dispute')
  @ApiOperation({ summary: 'Open dispute for transaction' })
  @ApiResponse({ status: 200, description: 'Dispute opened' })
  async dispute(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() data: { reason: string; description: string },
  ) {
    return this.transactionService.dispute(id, userId, data);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel transaction' })
  @ApiResponse({ status: 200, description: 'Transaction cancelled' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('reason') reason?: string,
  ) {
    return this.transactionService.cancel(id, userId, reason);
  }
}
