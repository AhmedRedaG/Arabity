import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from 'src/auth/decorator/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User('sub', ParseUUIDPipe) id: string) {
    const data = this.userService.getProfile(id);
    return data;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    return { user };
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  updateProfile(
    @User('sub', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const data = this.userService.update(id, dto);
    return data;
  }

  @UseGuards(AuthGuard)
  @Patch('password')
  updatePassword(
    @User('sub', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    const data = this.userService.changePassword(id, dto);
    return data;
  }

  @UseGuards(AuthGuard)
  @Delete('profile')
  deleteProfile(@User('sub', ParseUUIDPipe) id: string) {
    const data = this.userService.delete(id);
    return data;
  }
}
