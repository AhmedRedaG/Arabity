import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/typeorm/entities/booking/booking.entity';
import { AddressModule } from 'src/core/address/address.module';
import { CarModule } from 'src/core/car/car.module';
import { ServiceModule } from 'src/core/service/service.module';
import { UserModule } from 'src/core/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    UserModule,
    CarModule,
    ServiceModule,
    AddressModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
