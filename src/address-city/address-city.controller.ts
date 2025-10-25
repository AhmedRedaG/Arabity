import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AddressCityService } from './address-city.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/typeorm/entities/user/user.entity';
import { CreateAddressCityDto } from './dto/create-address-city.dto';
import { UpdateAddressCityDto } from './dto/update-address-city.dto';

@Controller('address-cities')
export class AddressCityController {
  constructor(private readonly addressCityService: AddressCityService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  createCity(@Body() dto: CreateAddressCityDto) {
    return this.addressCityService.create(dto);
  }

  @Get()
  findAll() {
    return this.addressCityService.findAll();
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  updateCity(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAddressCityDto,
  ) {
    return this.addressCityService.update(id, dto);
  }
}
