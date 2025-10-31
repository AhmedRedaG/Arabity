import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/core/booking/entities/booking.entity';
import { AddressModule } from 'src/core/address/address.module';
import { CarModule } from 'src/core/car/car.module';
import { ServiceModule } from 'src/core/service/service.module';
import { UserModule } from 'src/core/user/user.module';
import { ComponentModule } from '../component/component.module';
import { ComponentCategoryModule } from '../component-category/component-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    UserModule,
    CarModule,
    ServiceModule,
    AddressModule,
    ComponentModule,
    ComponentCategoryModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
