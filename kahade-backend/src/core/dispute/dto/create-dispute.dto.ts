import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateDisputeDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  transactionId: string;

  @ApiProperty({ example: 'Product not as described' })
  @IsString()
  reason: string;

  @ApiProperty({ example: 'The product received is different from the description' })
  @IsString()
  description: string;
}
