import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OAuthLoginDTO {
  @ApiProperty()
  @IsString()
  idToken!: string;
}
