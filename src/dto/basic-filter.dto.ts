import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class BasicFilterDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  @ApiProperty({ required: false })
  orderBy?: 'asc' | 'desc';
}
