import { Module } from '@nestjs/common';
import { AddressCityService } from './address-city.service';
import { AddressCityController } from './address-city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressCity } from 'src/address-city/entities/address-city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressCity])],
  controllers: [AddressCityController],
  providers: [AddressCityService],
  exports: [AddressCityService],
})
export class AddressCityModule {}
