import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/typeorm/entities/service/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
  ) {}

  async create(dto: CreateServiceDto) {
    const service = await this.serviceRepository.save(dto);
    return { service };
  }

  async findAll(isActive?: boolean) {
    const services = await this.serviceRepository.find({
      where: { isActive },
    });
    return { services };
  }

  async findOne(id: string) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) {
      throw new Error('service not found');
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    await this.serviceRepository.update(id, dto);
    return { message: 'service updated successfully' };
  }
}
