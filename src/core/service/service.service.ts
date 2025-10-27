import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/core/service/entities/service.entity';
import { Repository } from 'typeorm';
import { UtilsService } from 'src/core/utils/utils.service';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/dto/options-query.dto';
import { ComponentCategoryService } from 'src/core/component-category/component-category.service';
import { ComponentCategory } from 'src/core/component-category/entities/component-category.entity';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    private UtilsService: UtilsService,
    private componentCategoryService: ComponentCategoryService,
  ) {}

  async create(dto: CreateServiceDto) {
    let categories: ComponentCategory[] | undefined;
    if (dto.categories) {
      categories = await Promise.all(
        dto.categories.map((id) =>
          this.componentCategoryService.findOneBy({ id }),
        ),
      );
    }
    const service = await this.serviceRepository.save({
      ...dto,
      categories,
    });
    return { service };
  }

  async findAll(inPagination: PaginationQueryDto, inOptions: OptionsQueryDto) {
    const { page, limit, offset } = this.UtilsService.getPaginationParams(
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

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<Service>) {
    const service = await this.serviceRepository.findOneBy(findOptions);
    if (!service) {
      throw new NotFoundException('service not found');
    }
    return service;
  }

  async findOne(id: string) {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: {
        categories: true,
        reviews: true,
      },
    });
    if (!service) {
      throw new NotFoundException('service not found');
    }
    return { service };
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOneBy({ id });
    let categories: ComponentCategory[] | undefined;
    if (dto.categories) {
      categories = await Promise.all(
        dto.categories.map((id) =>
          this.componentCategoryService.findOneBy({ id }),
        ),
      );
      delete dto.categories;
    }
    await this.serviceRepository.update(id, {
      ...dto,
      categories,
    });
    return { message: 'service updated successfully' };
  }
}
