import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComponentCategorieDto } from './dto/create-component-categorie.dto';
import { UpdateComponentCategorieDto } from './dto/update-component-categorie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ComponentCategory } from 'src/typeorm/entities/service/component-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComponentCategorieService {
  constructor(
    @InjectRepository(ComponentCategory)
    private componentCategoryRepository: Repository<ComponentCategory>,
  ) {}

  async saveOrConflict(
    categorie: ComponentCategory | UpdateComponentCategorieDto,
  ) {
    try {
      return await this.componentCategoryRepository.save(categorie);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('categorie already exists');
      } else {
        throw err;
      }
    }
  }

  async create(dto: CreateComponentCategorieDto) {
    const categorie = await this.saveOrConflict(dto);
    return { categorie };
  }

  async findAll() {
    const categories = await this.componentCategoryRepository.find();
    return { categories };
  }

  async findOne(id: string) {
    const categorie = await this.componentCategoryRepository.findOne({
      where: { id },
    });
    if (!categorie) {
      throw new NotFoundException('categorie not found');
    }
    return categorie;
  }

  async update(id: string, dto: UpdateComponentCategorieDto) {
    const categorie = await this.findOne(id);
    Object.assign(categorie, dto);
    await this.saveOrConflict(categorie);
    return { message: 'categorie updated successfully' };
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.componentCategoryRepository.delete(id);
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('Cant removed categorie with components');
      }
    }
    return { message: 'categorie removed successfully' };
  }
}
