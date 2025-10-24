import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from 'src/typeorm/entities/service/component.entity';
import { Repository } from 'typeorm';
import { ServiceService } from 'src/service/service.service';
import { ComponentCategorieService } from 'src/component-categorie/component-categorie.service';
import { CarTypeService } from 'src/car-type/car-type.service';
import { PaginationQueryDto } from 'src/helper/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/helper/dto/options-query.dto';
import { HelperService } from 'src/helper/helper.service';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
    private serviceService: ServiceService,
    private componentCategorieService: ComponentCategorieService,
    private carTypeService: CarTypeService,
    private helperService: HelperService,
  ) {}

  async create(dto: CreateComponentDto) {
    const service = await this.serviceService.findOne(dto.serviceId);
    const category = await this.componentCategorieService.findOne(
      dto.categoryId,
    );
    const carTypes = await Promise.all(
      dto.carTypes.map((id) => this.carTypeService.findOne(id)),
    );
    const component = await this.componentRepository.save({
      ...dto,
      service,
      category,
      carTypes,
    });
    return { component };
  }

  async findAll(
    inPagination: PaginationQueryDto,
    inOptions: OptionsQueryDto,
    inCondition?: any,
  ) {
    const { page, limit, offset } = this.helperService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );

    const where = { isActive: inOptions.isActive };
    if (inCondition) {
      Object.assign(where, inCondition);
    }

    const [components, total] = await this.componentRepository.findAndCount({
      where,
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

    return { pagination, components };
  }

  async findOne(id: string) {
    const component = await this.componentRepository.findOne({
      where: { id },
      relations: {
        service: true,
        category: true,
        carTypes: true,
      },
    });
    if (!component) {
      throw new NotFoundException('component not found');
    }
    return component;
  }

  async update(id: string, dto: UpdateComponentDto) {
    const component = await this.findOne(id);
    let service = component.service;
    let category = component.category;
    let carTypes = component.carTypes;

    if (dto.serviceId) {
      service = await this.serviceService.findOne(dto.serviceId);
    }
    if (dto.categoryId) {
      category = await this.componentCategorieService.findOne(dto.categoryId);
    }
    if (dto.carTypes) {
      carTypes = await Promise.all(
        dto.carTypes.map((id) => this.carTypeService.findOne(id)),
      );
    }

    await this.componentRepository.save({
      id,
      ...dto,
      service,
      category,
      carTypes,
    });

    return { message: 'component updated successfully' };
  }
}
