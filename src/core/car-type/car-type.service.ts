import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarType } from 'src/core/car-type/entities/car-type.entity';
import { Repository } from 'typeorm';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';

@Injectable()
export class CarTypeService {
  constructor(
    @InjectRepository(CarType) private carTypeRepository: Repository<CarType>,
  ) {}

  async findConflictBy(findOptions: TypeOrmFindOptionsWhere<CarType>) {
    const isCarTypeExist = await this.carTypeRepository.findOneBy(findOptions);
    if (isCarTypeExist) {
      throw new ConflictException('car type already exists');
    }
  }

  async create(dto: CreateCarTypeDto) {
    await this.findConflictBy({ maker: dto.maker });
    const carType = await this.carTypeRepository.save(dto);
    return { carType };
  }

  async findAll() {
    const carTypes = await this.carTypeRepository.find();
    return { carTypes };
  }

  async findOne(id: string) {
    const carType = await this.findOneBy({ id });
    return { carType };
  }

  async findOneBy(
    findOptions: TypeOrmFindOptionsWhere<CarType>,
  ): Promise<CarType> {
    const carType = await this.carTypeRepository.findOneBy(findOptions);
    if (!carType) {
      throw new NotFoundException('car type not found');
    }
    return carType;
  }

  async update(id: string, dto: UpdateCarTypeDto) {
    await this.findOneBy({ id });
    await this.findConflictBy({ maker: dto.maker });
    await this.carTypeRepository.update(id, dto);
    return { message: 'car type updated successfully' };
  }
}
