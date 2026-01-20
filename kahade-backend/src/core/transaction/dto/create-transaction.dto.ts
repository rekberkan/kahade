import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { OrderCategory, Currency } from '../../../common/shims/prisma-types.shim';

export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(OrderCategory)
  category: OrderCategory;

  @IsNumber()
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsString()
  @IsOptional()
  counterpartyId?: string;
}
