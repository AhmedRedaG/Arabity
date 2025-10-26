import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorator/user.decorator';

@UseGuards(AuthGuard)
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@User('sub') userId: string, @Body() dto: CreateCarDto) {
    return this.carService.create(userId, dto);
  }

  @Get()
  findAll(@User('sub') userId: string) {
    return this.carService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) carId: string,
  ) {
    return this.carService.findOne(userId, carId);
  }

  @Patch(':id')
  update(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) carId: string,
    @Body() dto: UpdateCarDto,
  ) {
    return this.carService.update(userId, carId, dto);
  }

  @Delete(':id')
  remove(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) carId: string,
  ) {
    return this.carService.remove(userId, carId);
  }
}
