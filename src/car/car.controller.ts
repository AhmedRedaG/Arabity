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
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/auth/decorator/user.decorator';

@Controller('cars')
@UseGuards(AuthGuard)
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
  async findOne(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) carId: string,
  ) {
    const car = await this.carService.findOne(userId, carId);
    return { car };
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
