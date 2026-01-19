import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('blockchain.rpcUrl');
    const privateKey = this.configService.get<string>('blockchain.privateKey');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    if (privateKey) {
      this.wallet = new ethers.Wallet(privateKey, this.provider);
    }
  }

  async recordTransaction(data: {
    transactionId: string;
    amount: number;
    buyerId: string;
    sellerId: string;
  }) {
    try {
      // In real implementation, this would interact with smart contract
      // For now, we'll simulate the transaction
      this.logger.log(`Recording transaction on blockchain: ${data.transactionId}`);

      // Simulate blockchain transaction
      const txHash = ethers.keccak256(
        ethers.toUtf8Bytes(`${data.transactionId}-${Date.now()}`),
      );

      return {
        hash: txHash,
        timestamp: new Date(),
        confirmed: true,
      };
    } catch (error) {
      this.logger.error('Failed to record transaction on blockchain', error);
      throw error;
    }
  }

  async getTransactionStatus(txHash: string) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) {
        return { status: 'not_found' };
      }

      const receipt = await this.provider.getTransactionReceipt(txHash);
      return {
        status: receipt?.status === 1 ? 'confirmed' : 'failed',
        blockNumber: receipt?.blockNumber,
        confirmations: receipt ? await receipt.confirmations() : 0,
      };
    } catch (error) {
      this.logger.error('Failed to get transaction status', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      this.logger.error('Failed to get balance', error);
      throw error;
    }
  }
}
