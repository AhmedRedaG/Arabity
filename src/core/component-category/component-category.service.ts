import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComponentCategoryDto } from './dto/create-component-category.dto';
import { UpdateComponentCategoryDto } from './dto/update-component-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ComponentCategory } from 'src/core/component-category/entities/component-category.entity';
import { Repository } from 'typeorm';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';

@Injectable()
export class ComponentCategoryService {
  constructor(
    @InjectRepository(ComponentCategory)
    private componentCategoryRepository: Repository<ComponentCategory>,
  ) {}

  async findConflictBy(
    findOptions: TypeOrmFindOptionsWhere<ComponentCategory>,
  ) {
    const isCategoryExist =
      await this.componentCategoryRepository.findOneBy(findOptions);
    if (isCategoryExist) {
      throw new ConflictException('category already exists');
    }
  }

  async create(dto: CreateComponentCategoryDto) {
    await this.findConflictBy({ name: dto.name });
    const category = await this.componentCategoryRepository.save(dto);
    return { category };
  }

  async findAll(findOptions?: TypeOrmFindOptionsWhere<ComponentCategory>) {
    const categories = await this.componentCategoryRepository.find({
      where: findOptions,
    });
    return { categories };
  }

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<ComponentCategory>) {
    const category =
      await this.componentCategoryRepository.findOneBy(findOptions);
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return category;
  }

  async findOne(id: string) {
    const category = await this.findOneBy({ id });
    return { category };
  }

  async update(id: string, dto: UpdateComponentCategoryDto) {
    await this.findOneBy({ id });
    await this.findConflictBy({ name: dto.name });
    await this.componentCategoryRepository.update(id, dto);
    return { message: 'category updated successfully' };
  }

  async remove(id: string) {
    await this.findOneBy({ id });
    try {
      await this.componentCategoryRepository.delete(id);
    } catch (err: any) {
      if (err instanceof Error && 'code' in err && err.code === '23503') {
        throw new BadRequestException('Cant removed category with components');
      }
      throw err;
    }
    return { message: 'category removed successfully' };
  }
}
