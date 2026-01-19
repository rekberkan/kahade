import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TransactionStatus } from '@prisma/client';

export class UpdateTransactionStatusDto {
  @ApiProperty({ enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
