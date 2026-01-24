import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TopUpDto {
  @ApiProperty({ description: 'Amount to top up in IDR', minimum: 10000 })
  @IsNumber()
  @Min(10000)
  amount: number;

  @ApiProperty({ description: 'Payment method (va_bca, va_bni, va_mandiri, ewallet_ovo, ewallet_gopay, etc.)' })
  @IsString()
  method: string;
}
