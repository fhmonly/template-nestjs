import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

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
  @Length(1, 255)
  refresh_token!: string;
}
