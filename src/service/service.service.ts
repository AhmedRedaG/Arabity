import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/typeorm/entities/service/service.entity';
import { Repository } from 'typeorm';
import { HelperService } from 'src/helper/helper.service';
import { PaginationQueryDto } from 'src/helper/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/helper/dto/options-query.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    private helperService: HelperService,
  ) {}

  async create(dto: CreateServiceDto) {
    const service = await this.serviceRepository.save(dto);
    return { service };
  }

  async findAll(inPagination: PaginationQueryDto, inOptions: OptionsQueryDto) {
    const { page, limit, offset } = this.helperService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );
    const [services, total] = await this.serviceRepository.findAndCount({
      where: { isActive: inOptions.isActive },
      skip: offset,
      take: limit,
      order: {
        [inOptions.orderBy]: inOptions.orderDirection,
      },
    });

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return { pagination, services };
  }

  async findOne(id: string) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException('service not found');
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    await this.serviceRepository.update(id, dto);
    return { message: 'service updated successfully' };
  }
}
