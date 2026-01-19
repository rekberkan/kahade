import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsOptional, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  sellerId: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Brand new iPhone 14 Pro Max 256GB' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 15000000 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'IDR' })
  @IsString()
  currency: string;
}
