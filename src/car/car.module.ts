import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../typeorm/entities/car/car.entity';
import { CarTypeModule } from 'src/car-type/car-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), CarTypeModule],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
