import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifyAccountMail } from './content/verify.content';
import { User } from 'src/core/user/entities/user.entity';
import { ResetPasswordMail } from './content/reset.content';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { BrevoMailOptions } from './types/email-options.types';

@Injectable()
export class EmailService implements OnModuleInit {
  private apiInstance!: SibApiV3Sdk.TransactionalEmailsApi;

  constructor(
    private configService: ConfigService,
    private verifyAccountMail: VerifyAccountMail,
    private resetPasswordMail: ResetPasswordMail,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeBrevoApi();
  }

  async initializeBrevoApi(): Promise<void> {
    try {
      const defaultClient = SibApiV3Sdk.ApiClient.instance;
      const apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = this.configService.get<string>('email.brevoApiKey')!;
      this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    } catch (error) {
      throw new Error(`Failed to initialize Brevo API: ${error}`);
    }
  }

  async sendMail(mailOptions: BrevoMailOptions): Promise<any> {
    if (!this.apiInstance) {
      throw new Error('Brevo API not initialized');
    }
    try {
      return await this.apiInstance.sendTransacEmail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  async sendVerifyTokenMail(
    user: User,
    verificationToken: string,
  ): Promise<any> {
    const mailOptions: BrevoMailOptions = this.verifyAccountMail.createMail(
      user,
      verificationToken,
    );

    return await this.sendMail(mailOptions);
  }

  async sendResetOtpMail(user: User, otp: number): Promise<any> {
    const mailOptions: BrevoMailOptions = this.resetPasswordMail.createMail(
      user,
      otp,
    );

    return await this.sendMail(mailOptions);
  }
}
