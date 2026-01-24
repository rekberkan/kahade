import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { DisputeDecision } from '@common/shims/prisma-types.shim';

export class ResolveDisputeDto {
  @ApiProperty({ enum: DisputeDecision, example: 'BUYER_WINS' })
  @IsEnum(DisputeDecision)
  decision: DisputeDecision;

  @ApiProperty({ example: '1000000', required: false, description: 'Amount in minor units (cents) to give to seller' })
  @IsOptional()
  @IsString()
  sellerAmountMinor?: string;

  @ApiProperty({ example: '500000', required: false, description: 'Amount in minor units (cents) to refund to buyer' })
  @IsOptional()
  @IsString()
  buyerRefundMinor?: string;

  @ApiProperty({ example: 'After reviewing evidence, buyer claim is valid' })
  @IsString()
  resolutionNotes: string;
}
