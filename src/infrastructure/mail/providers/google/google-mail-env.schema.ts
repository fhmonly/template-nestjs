import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GoogleMailEnv {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  GMAIL_USER!: string;

  @IsString()
  @IsNotEmpty()
  GMAIL_SECRET_KEY!: string;
}
