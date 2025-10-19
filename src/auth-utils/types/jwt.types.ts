export interface JwtPayload {
  sub: string;
}

export enum JwtTypes {
  ACC = 'access',
  VER = 'verification',
  RESET = 'reset',
}
