import { IsEnum, IsNumber, IsString, IsOptional, MinLength, IsEmail, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TransactionRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export enum TransactionFeePayer {
  BUYER = 'buyer',
  SELLER = 'seller',
  SPLIT = 'split',
}

export enum TransactionCategory {
  ELECTRONICS = 'ELECTRONICS',
  SERVICES = 'SERVICES',
  DIGITAL_GOODS = 'DIGITAL_GOODS',
  PHYSICAL_GOODS = 'PHYSICAL_GOODS',
  OTHER = 'OTHER',
}

export class CreateTransactionDto {
  @ApiPropertyOptional({ description: 'Counterparty email address' })
  @IsEmail()
  @IsOptional()
  counterpartyEmail?: string;

  @ApiPropertyOptional({ description: 'Counterparty user ID' })
  @IsString()
  @IsOptional()
  counterpartyId?: string;

  @ApiProperty({ enum: TransactionRole, description: 'Role of the initiator' })
  @IsEnum(TransactionRole)
  role: TransactionRole;

  @ApiProperty({ description: 'Transaction title' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ description: 'Transaction description' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ enum: TransactionCategory, description: 'Transaction category' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Transaction amount in IDR' })
  @IsNumber()
  @Min(10000)
  amount: number;

  @ApiProperty({ enum: TransactionFeePayer, description: 'Who pays the platform fee' })
  @IsEnum(TransactionFeePayer)
  feePaidBy: TransactionFeePayer;

  @ApiPropertyOptional({ description: 'Custom terms and conditions' })
  @IsString()
  @IsOptional()
  terms?: string;
}
