import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarType } from 'src/typeorm/entities/car/car-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarTypeService {
  constructor(
    @InjectRepository(CarType) private carTypeRepository: Repository<CarType>,
  ) {}

  async saveOrConflict(carType: CarType | CreateCarTypeDto) {
    try {
      return await this.carTypeRepository.save(carType);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('car type already exists');
      } else {
        throw err;
      }
    }
  }

  async create(dto: CreateCarTypeDto) {
    const carType = await this.saveOrConflict(dto);
    return { carType };
  }

  async findAll() {
    const carTypes = await this.carTypeRepository.find();
    return { carTypes };
  }

  async findOne(id: string): Promise<CarType> {
    const carType = await this.carTypeRepository.findOneBy({ id });
    if (!carType) {
      throw new NotFoundException('car type not found');
    }
    return carType;
  }

  async update(id: string, dto: UpdateCarTypeDto) {
    const carType = await this.findOne(id);
    Object.assign(carType, dto);
    await this.saveOrConflict(carType);
    return { carType };
  }
}
