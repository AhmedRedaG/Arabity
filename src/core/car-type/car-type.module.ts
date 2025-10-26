import { Module } from '@nestjs/common';
import { CarTypeService } from './car-type.service';
import { CarTypeController } from './car-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarType } from 'src/typeorm/entities/car/car-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarType])],
  controllers: [CarTypeController],
  providers: [CarTypeService],
  exports: [CarTypeService],
})
export class CarTypeModule {}
