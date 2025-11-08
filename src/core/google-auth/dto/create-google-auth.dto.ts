import { IsJWT } from 'class-validator';

export class CreateGoogleAuthDto {
  @IsJWT()
  googleToken: string;
}
