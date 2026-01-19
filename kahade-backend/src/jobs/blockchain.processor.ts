import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { BlockchainService } from '@integrations/blockchain/blockchain.service';

@Processor('blockchain')
export class BlockchainProcessor {
  private readonly logger = new Logger(BlockchainProcessor.name);

  constructor(private readonly blockchainService: BlockchainService) {}

  @Process('record-transaction')
  async handleRecordTransaction(job: Job) {
    this.logger.debug(`Processing blockchain job: ${job.id}`);
    const { transactionId, amount, buyerId, sellerId } = job.data;

    try {
      const result = await this.blockchainService.recordTransaction({
        transactionId,
        amount,
        buyerId,
        sellerId,
      });
      this.logger.log(`Transaction recorded on blockchain: ${result.hash}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to record transaction: ${error.message}`);
      throw error;
    }
  }
}
