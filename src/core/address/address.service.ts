import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/core/address/entities/address.entity';
import { Repository } from 'typeorm';
import { AddressCityService } from 'src/core/address-city/address-city.service';
import { AddressCity } from 'src/core/address-city/entities/address-city.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    private addressCityService: AddressCityService,
  ) {}

  async create(userId: string, dto: CreateAddressDto) {
    const city = await this.addressCityService.findById(dto.cityId);
    const address = await this.addressRepository.save({
      ...dto,
      city,
      user: { id: userId },
    });
    address.city = city;
    return { address };
  }

  async findAll(userId: string) {
    const addresses = await this.addressRepository.find({
      where: { user: { id: userId } },
      relations: { city: true },
    });
    return { addresses };
  }

  async findOne(userId: string, addressId: string) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user: { id: userId } },
      relations: { city: true },
    });
    if (!address) {
      throw new NotFoundException('address not found');
    }
    return { address };
  }

  async findById(addressId: string) {
    const address = await this.addressRepository.findOneBy({ id: addressId });
    if (!address) {
      throw new NotFoundException('address not found');
    }
    return address;
  }

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    await this.findOne(userId, addressId);

    let city: AddressCity | undefined;
    if (dto.cityId) {
      city = await this.addressCityService.findById(dto.cityId);
      delete dto.cityId;
    }

    await this.addressRepository.update(addressId, {
      ...dto,
      city,
    });

    return { message: 'address updated successfully' };
  }

  async remove(userId: string, addressId: string) {
    await this.findOne(userId, addressId);
    await this.addressRepository.delete(addressId);
    return { message: 'address deleted successfully' };
  }
}
