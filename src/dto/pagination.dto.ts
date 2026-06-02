import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;
}
