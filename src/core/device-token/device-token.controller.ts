import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DeviceTokenService } from './device-token.service';
import { UpdateDeviceTokenDto } from './dto/update-device-token.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorator/user.decorator';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import { RoleGuard } from 'src/guard/role.guard';
import { InvalidateDeviceTokenDto } from './dto/invalidate-device-token.dto';

@UseGuards(AuthGuard)
@Controller('device-tokens')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('user-tokens/:userId')
  async getUserTokens(@Param('userId', ParseUUIDPipe) userId: string) {
    const tokens = await this.deviceTokenService.getUserTokens(userId);
    return { tokens };
  }

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Post('invalidate')
  @HttpCode(HttpStatus.OK)
  invalidateToken(@Body() dto: InvalidateDeviceTokenDto) {
    return this.deviceTokenService.invalidateToken(dto.deviceToken);
  }

  @Post('register')
  registerToken(
    @User('sub') userId: string,
    @Body() dto: CreateDeviceTokenDto,
  ) {
    return this.deviceTokenService.create(userId, dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@User('sub') userId: string, @Body() dto: UpdateDeviceTokenDto) {
    return this.deviceTokenService.refresh(userId, dto);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logoutAll(@User('sub') userId: string) {
    return this.deviceTokenService.deactivate(userId);
  }

  @Delete('logout/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(
    @User('sub') userId: string,
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ) {
    return this.deviceTokenService.deactivate(userId, deviceId);
  }
}
