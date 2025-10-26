import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressCityDto } from './dto/create-address-city.dto';
import { UpdateAddressCityDto } from './dto/update-address-city.dto';
import { AddressCity } from 'src/address-city/entities/address-city.entity';

@Injectable()
export class AddressCityService {
  constructor(
    @InjectRepository(AddressCity)
    private addressCityRepository: Repository<AddressCity>,
  ) {}

  async create(dto: CreateAddressCityDto) {
    const city = await this.addressCityRepository.save(dto);
    return { city };
  }

  async findAll() {
    const cities = await this.addressCityRepository.find();
    return { cities };
  }

  async findById(cityId: string) {
    const city = await this.addressCityRepository.findOneBy({ id: cityId });
    if (!city) {
      throw new NotFoundException('city not found');
    }
    return city;
  }

  async update(cityId: string, dto: UpdateAddressCityDto) {
    await this.findById(cityId);
    await this.addressCityRepository.update(cityId, dto);
    return { message: 'city updated successfully' };
  }
}
