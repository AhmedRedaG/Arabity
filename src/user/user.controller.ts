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

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@User('sub') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    return { user };
  }

  @Patch('profile')
  updateProfile(@User('sub') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Patch('password')
  updatePassword(@User('sub') id: string, @Body() dto: UpdatePasswordDto) {
    return this.userService.changePassword(id, dto);
  }

  @Delete('profile')
  deleteProfile(@User('sub') id: string) {
    return this.userService.remove(id);
  }
}
