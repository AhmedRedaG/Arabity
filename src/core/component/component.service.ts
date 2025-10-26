import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from 'src/typeorm/entities/service/component.entity';
import { Repository } from 'typeorm';
import { ComponentCategoryService } from 'src/core/component-category/component-category.service';
import { CarTypeService } from 'src/core/car-type/car-type.service';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/dto/options-query.dto';
import { UtilsService } from 'src/core/utils/utils.service';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
    private componentCategoryService: ComponentCategoryService,
    private carTypeService: CarTypeService,
    private UtilsService: UtilsService,
  ) {}

  async create(dto: CreateComponentDto) {
    const category = await this.componentCategoryService.findOne(
      dto.categoryId,
    );
    const carTypes = await Promise.all(
      dto.carTypes.map((id) => this.carTypeService.findOne(id)),
    );
    const component = await this.componentRepository.save({
      ...dto,
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
    const { page, limit, offset } = this.UtilsService.getPaginationParams(
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
    let category = component.category;
    let carTypes = component.carTypes;

    if (dto.categoryId) {
      category = await this.componentCategoryService.findOne(dto.categoryId);
    }
    if (dto.carTypes) {
      carTypes = await Promise.all(
        dto.carTypes.map((id) => this.carTypeService.findOne(id)),
      );
    }

    await this.componentRepository.save({
      id,
      ...dto,
      category,
      carTypes,
    });

    return { message: 'component updated successfully' };
  }
}
