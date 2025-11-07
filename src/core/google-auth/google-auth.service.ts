import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthUtilsService } from '../auth-utils/auth-utils.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtTypes } from 'src/types/jwt.types';

@Injectable()
export class GoogleAuthService {
  private googleClientId: string;
  private googleClient: OAuth2Client;

  constructor(
    private userService: UserService,
    private authUtilsService: AuthUtilsService,
    private configService: ConfigService,
  ) {
    this.googleClientId = this.configService.get<string>(
      'googleOAuth.clientId',
    )!;
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async verifyGoogleToken(googleToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleToken,
        audience: this.googleClientId,
      });

      const payload = ticket.getPayload()!;

      if (!payload.email_verified)
        throw new UnauthorizedException('you google email not verified');

      return {
        googleId: payload.sub,
        email: payload.email!,
        firstName: payload.given_name || 'unknown',
        lastName: payload.family_name || 'unknown',
        isVerified: true,
      };
    } catch (error) {
      throw new UnauthorizedException('invalid google token');
    }
  }

  async googleLogin(googleToken: string) {
    const googleUser = await this.verifyGoogleToken(googleToken);

    let user = await this.userService.findByEmail(googleUser.email);
    if (!user) {
      user = await this.userService.createGoogleUser(googleUser);
    }

    const accessToken = await this.authUtilsService.generateToken(
      { sub: user.id, role: user.role },
      JwtTypes.ACC,
    );

    return { user, accessToken };
  }
}
