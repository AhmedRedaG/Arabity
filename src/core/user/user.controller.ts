import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from 'src/decorator/user.decorator';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from './entities/user.entity';
import { RoleGuard } from 'src/guard/role.guard';
import { OptionsQueryDto } from 'src/dto/options-query.dto';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('all')
  getAllUsers(
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.userService.findAll(pagination, options);
  }

  @Get('profile')
  getProfile(@User('sub') id: string) {
    return this.userService.findOne(id);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
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
