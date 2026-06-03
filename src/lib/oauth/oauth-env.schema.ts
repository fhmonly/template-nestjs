import { IsString } from 'class-validator';

export class OAuthEnvSchema {
  @IsString()
  GOOGLE_CLIENT_ID!: string;
}
