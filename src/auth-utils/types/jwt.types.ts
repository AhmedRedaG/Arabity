import { UserRole } from 'src/typeorm/entities/user/user.entity';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export enum JwtTypes {
  ACC = 'access',
  VER = 'verification',
  RESET = 'reset',
}
