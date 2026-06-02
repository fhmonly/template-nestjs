import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class DatabaseEnvSchema {
  @IsString()
  DB_USERNAME!: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value || '')
  DB_PASSWORD!: string;

  @IsString()
  DB_HOST!: string;

  @Type(() => Number)
  @IsInt()
  DB_PORT!: number;

  @IsString()
  DB_DATABASE!: string;
}
