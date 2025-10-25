import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/typeorm/entities/booking/booking.entity';
import { AddressModule } from 'src/address/address.module';
import { CarModule } from 'src/car/car.module';
import { ServiceModule } from 'src/service/service.module';
import { UserModule } from 'src/user/user.module';

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
