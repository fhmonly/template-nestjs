import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class CacheEnvSchema {
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return false;
    }
    return ['true', '1', 1, true].includes(
      (value as string).toLowerCase().trim(),
    );
  })
  @IsOptional()
  @IsBoolean()
  CACHE_ENABLE!: boolean;
}
