import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

enum TransactionStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

export class UpdateTransactionStatusDto {
  @ApiProperty({ enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
