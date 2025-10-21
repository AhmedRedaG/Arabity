import { Module } from '@nestjs/common';
import { CarTypeService } from './car-type.service';
import { CarTypeController } from './car-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarType } from 'src/typeorm/entities/car/car-type.entity';
import { AuthUtilsModule } from 'src/auth-utils/auth-utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarType]), AuthUtilsModule],
  controllers: [CarTypeController],
  providers: [CarTypeService],
})
export class CarTypeModule {}
