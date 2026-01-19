import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '@common/pipes/parse-objectid.pipe';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create new escrow transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async create(@CurrentUser('id') userId: string, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(userId, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.transactionService.findAllByUser(userId, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Returns transaction' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser('id') userId: string) {
    return this.transactionService.findOne(id, userId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update transaction status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  async updateStatus(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() updateStatusDto: UpdateTransactionStatusDto,
  ) {
    return this.transactionService.updateStatus(id, userId, updateStatusDto);
  }

  @Post(':id/confirm-payment')
  @ApiOperation({ summary: 'Confirm payment received' })
  @ApiResponse({ status: 200, description: 'Payment confirmed' })
  async confirmPayment(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser('id') userId: string) {
    return this.transactionService.confirmPayment(id, userId);
  }

  @Post(':id/release-funds')
  @ApiOperation({ summary: 'Release escrowed funds to seller' })
  @ApiResponse({ status: 200, description: 'Funds released' })
  async releaseFunds(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser('id') userId: string) {
    return this.transactionService.releaseFunds(id, userId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel transaction' })
  @ApiResponse({ status: 200, description: 'Transaction cancelled' })
  async cancel(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser('id') userId: string) {
    return this.transactionService.cancel(id, userId);
  }
}
