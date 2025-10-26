import { UserRole } from 'src/user/entities/user.entity';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export enum JwtTypes {
  ACC = 'access',
  VER = 'verification',
  RESET = 'reset',
}
