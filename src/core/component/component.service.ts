import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from 'src/core/component/entities/component.entity';
import { Repository } from 'typeorm';
import { ComponentCategoryService } from 'src/core/component-category/component-category.service';
import { CarTypeService } from 'src/core/car-type/car-type.service';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/dto/options-query.dto';
import { UtilsService } from 'src/core/utils/utils.service';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';
import { ComponentCategory } from '../component-category/entities/component-category.entity';
import { CarType } from '../car-type/entities/car-type.entity';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
    private componentCategoryService: ComponentCategoryService,
    private carTypeService: CarTypeService,
    private utilsService: UtilsService,
  ) {}

  async create(dto: CreateComponentDto) {
    const category = await this.componentCategoryService.findOneBy({
      id: dto.categoryId,
    });
    const carTypes = await Promise.all(
      dto.carTypes.map((id) => this.carTypeService.findOneBy({ id })),
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
    inCondition?: TypeOrmFindOptionsWhere<Component>,
  ) {
    const { page, limit, offset } = this.utilsService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );

    const where = { isActive: inOptions.isActive };
    if (inCondition) {
      Object.assign(where, inCondition);
    }

    const [components, total] = await this.componentRepository.findAndCount({
      where,
      relations: {
        category: true,
      },
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

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<Component>) {
    const component = await this.componentRepository.findOneBy(findOptions);
    if (!component) {
      throw new NotFoundException('component not found');
    }
    return component;
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
    return { component };
  }

  async findOneByCarTypeWithCategory(id: string, carTypeId: string) {
    const component = await this.componentRepository.findOne({
      where: {
        id,
        isActive: true,
        carTypes: {
          id: carTypeId,
        },
      },
      relations: { category: true },
    });
    if (!component) {
      throw new NotFoundException('component not found');
    }
    return component;
  }

  async findForBookingByCarType(inComponentIds: string[], carTypeId: string) {
    const components = await Promise.all(
      inComponentIds.map((id) =>
        this.findOneByCarTypeWithCategory(id, carTypeId),
      ),
    );
    return components;
  }

  async update(id: string, dto: UpdateComponentDto) {
    await this.findOneBy({ id });

    let category: ComponentCategory | undefined;
    let carTypes: CarType[] | undefined;
    if (dto.categoryId) {
      category = await this.componentCategoryService.findOneBy({
        id: dto.categoryId,
      });
      delete dto.categoryId;
    }
    if (dto.carTypes) {
      carTypes = await Promise.all(
        dto.carTypes.map((id) => this.carTypeService.findOneBy({ id })),
      );
      delete dto.carTypes;
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
