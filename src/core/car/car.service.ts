import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../../typeorm/entities/car/car.entity';
import { Repository } from 'typeorm';
import { CarTypeService } from 'src/core/car-type/car-type.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
    private carTypeService: CarTypeService,
  ) {}

  async create(userId: string, dto: CreateCarDto) {
    const carType = await this.carTypeService.findOne(dto.carTypeId);
    const car = await this.carRepository.save({
      user: { id: userId },
      type: carType,
      ...dto,
    });
    return { car };
  }

  async findAll(userId: string) {
    const cars = await this.carRepository.find({
      where: { user: { id: userId } },
      relations: {
        type: true,
      },
    });
    return { cars };
  }

  async findOne(userId: string, carId: string) {
    const car = await this.carRepository.findOne({
      where: { user: { id: userId }, id: carId },
      relations: {
        type: true,
      },
    });
    if (!car) {
      throw new NotFoundException('car not found');
    }
    return car;
  }

  async update(userId: string, carId: string, dto: UpdateCarDto) {
    await this.carRepository.save({
      id: carId,
      ...dto,
    });
    return { message: 'car updated successfully' };
  }

  async remove(userId: string, carId: string) {
    await this.findOne(userId, carId);
    await this.carRepository.delete(carId);
    return { message: 'car removed successfully' };
  }
}
