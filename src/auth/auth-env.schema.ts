import { IsNotEmpty, IsString } from 'class-validator';
import ms from 'ms';
import { IsMsString } from 'src/utils/validator/ms.validator';

export class AuthEnvSchema {
  @IsString()
  @IsNotEmpty()
  AUTH_ACCESS_TOKEN_SECRET!: string;

  @IsMsString()
  @IsNotEmpty()
  AUTH_ACCESS_TOKEN_EXPIRES_IN!: ms.StringValue;

  @IsString()
  @IsNotEmpty()
  AUTH_REFRESH_TOKEN_SECRET!: string;

  @IsMsString()
  @IsNotEmpty()
  AUTH_REFRESH_TOKEN_EXPIRES_IN!: ms.StringValue;

  get accessTokenExpiresInMs(): number {
    return ms(this.AUTH_ACCESS_TOKEN_EXPIRES_IN);
  }

  get refreshTokenExpiresInMs(): number {
    return ms(this.AUTH_REFRESH_TOKEN_EXPIRES_IN);
  }
}
