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
import { CarTypeService } from './car-type.service';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from 'src/core/user/entities/user.entity';

@Controller('car-types')
export class CarTypeController {
  constructor(private readonly carTypeService: CarTypeService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() dto: CreateCarTypeDto) {
    return this.carTypeService.create(dto);
  }

  @Get()
  findAll() {
    return this.carTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const carType = await this.carTypeService.findOne(id);
    return { carType };
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCarTypeDto,
  ) {
    return this.carTypeService.update(id, dto);
  }
}
