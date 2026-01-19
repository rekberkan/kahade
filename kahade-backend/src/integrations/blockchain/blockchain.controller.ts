import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@ApiTags('blockchain')
@Controller('blockchain')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('transaction/:hash')
  @ApiOperation({ summary: 'Get blockchain transaction status' })
  @ApiResponse({ status: 200, description: 'Returns transaction status' })
  async getTransactionStatus(@Param('hash') hash: string) {
    return this.blockchainService.getTransactionStatus(hash);
  }

  @Get('balance/:address')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Returns wallet balance' })
  async getBalance(@Param('address') address: string) {
    const balance = await this.blockchainService.getBalance(address);
    return { address, balance };
  }
}
