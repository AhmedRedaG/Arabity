import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressCityDto } from './dto/create-address-city.dto';
import { UpdateAddressCityDto } from './dto/update-address-city.dto';
import { AddressCity } from 'src/core/address-city/entities/address-city.entity';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';

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

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<AddressCity>) {
    const city = await this.addressCityRepository.findOneBy(findOptions);
    if (!city) {
      throw new NotFoundException('city not found');
    }
    return city;
  }

  async update(cityId: string, dto: UpdateAddressCityDto) {
    await this.findOneBy({ id: cityId });
    await this.addressCityRepository.update(cityId, dto);
    return { message: 'city updated successfully' };
  }
}
