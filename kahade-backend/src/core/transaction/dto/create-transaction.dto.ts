import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'MacBook Pro 2023' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'High-end laptop in excellent condition', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 25000000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'IDR', default: 'IDR' })
  @IsString()
  currency: string = 'IDR';

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  buyerId: string;
}
