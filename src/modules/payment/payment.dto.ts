import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, Min } from 'class-validator';

export class PaymentDTO {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @ApiProperty()
  amount!: number;

  @ApiProperty()
  @IsString()
  orderId!: string;
}

export class PaymentStatusDTO extends PickType(PaymentDTO, ['orderId']) {}
