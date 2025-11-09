export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  serverEmail: string;
  serverEmailPass: string;
}

export interface OtpConfig {
  min: number;
  max: number;
  expiresInMS: number;
  maxAttempts: number;
  coolDown: number;
  maxCoolDown: number;
}

export interface VerificationConfig {
  maxAttempts: number;
  coolDown: number;
  maxCoolDown: number;
}

export interface AuthAttemptConfig {
  maxAttempts: number;
  maxErrorMessage: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: number;
}

export interface KashierPaymentConfig {
  merchantId: string;
  apiKey: string;
  mode: string;
  redirectUrl: string;
  // webhookUrl: string;
}

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}
