import { IsNumber, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({ description: 'Amount to withdraw in IDR', minimum: 50000 })
  @IsNumber()
  @Min(50000)
  amount: number;

  @ApiProperty({ description: 'Bank code (BCA, BNI, MANDIRI, BRI, etc.)' })
  @IsString()
  bankCode: string;

  @ApiProperty({ description: 'Bank account number' })
  @IsString()
  @MinLength(8)
  accountNumber: string;

  @ApiProperty({ description: 'Account holder name' })
  @IsString()
  @MinLength(3)
  accountName: string;
}
