import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, IsUrl } from 'class-validator';

export class AuthRegisterDTO {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;

  @ApiProperty({
    description: 'Complete frontend url for verifying user email',
    example: 'https://myfrontend.com/auth/verify',
  })
  @IsUrl({
    require_tld: true, // make sure it has a top level domain e.g. .com or .co.uk
    require_protocol: true, // make sure it has a protocol (e.g. http:// or https://)
  })
  redirectUrl!: string;

  @ApiProperty()
  @IsString()
  appName!: string;
}

export class AuthLoginDTO {
  @ApiProperty()
  @IsString()
  identifier!: string;

  @ApiProperty()
  @IsString()
  password!: string;
}

export class AuthRefreshTokenDTO {
  @ApiProperty()
  @IsString()
  refresh_token!: string;
}

export class AuthActivateAccount {
  @ApiProperty()
  @IsString()
  token!: string;
}
