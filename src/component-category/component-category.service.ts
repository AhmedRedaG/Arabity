import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComponentCategoryDto } from './dto/create-component-category.dto';
import { UpdateComponentCategoryDto } from './dto/update-component-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ComponentCategory } from 'src/typeorm/entities/service/component-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComponentCategoryService {
  constructor(
    @InjectRepository(ComponentCategory)
    private componentCategoryRepository: Repository<ComponentCategory>,
  ) {}

  async saveOrConflict(
    category: ComponentCategory | UpdateComponentCategoryDto,
  ) {
    try {
      return await this.componentCategoryRepository.save(category);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('category already exists');
      } else {
        throw err;
      }
    }
  }

  async create(dto: CreateComponentCategoryDto) {
    const category = await this.saveOrConflict(dto);
    return { category };
  }

  async findAll() {
    const categories = await this.componentCategoryRepository.find();
    return { categories };
  }

  async findOne(id: string) {
    const category = await this.componentCategoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateComponentCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    await this.saveOrConflict(category);
    return { message: 'category updated successfully' };
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.componentCategoryRepository.delete(id);
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('Cant removed category with components');
      }
    }
    return { message: 'category removed successfully' };
  }
}
