import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressCityDto } from './dto/create-address-city.dto';
import { UpdateAddressCityDto } from './dto/update-address-city.dto';
import { AddressCity } from 'src/typeorm/entities/address/address-city.entity';

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

  async findOne(cityId: string) {
    const city = await this.addressCityRepository.findOne({
      where: { id: cityId },
    });
    if (!city) {
      throw new NotFoundException('city not found');
    }
    return city;
  }

  async update(cityId: string, dto: UpdateAddressCityDto) {
    const city = await this.findOne(cityId);
    Object.assign(city, dto);

    await this.addressCityRepository.save(city);
    return { message: 'city updated successfully' };
  }
}
