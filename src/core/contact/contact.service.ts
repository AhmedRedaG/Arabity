import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { ContactOptionsQueryDto } from './dto/contact-options-query.dto';
import { UtilsService } from '../utils/utils.service';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private utilsService: UtilsService,
  ) {}

  async create(dto: CreateContactDto) {
    const contact = await this.contactRepository.save(dto);
    return { contact };
  }

  async findAll(
    inPagination: PaginationQueryDto,
    inContactOptions: ContactOptionsQueryDto,
  ) {
    const { page, limit, offset } = this.utilsService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );

    const where = {};
    if (inContactOptions.email) {
      where['email'] = inContactOptions.email;
    }
    if (inContactOptions.status) {
      where['status'] = inContactOptions.status;
    }

    const [contacts, total] = await this.contactRepository.findAndCount({
      where,
      select: ['id', 'title', 'email', 'status', 'updatedAt'],
      skip: offset,
      take: limit,
      order: {
        [inContactOptions.orderBy]: inContactOptions.orderDirection,
      },
    });

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return { pagination, contacts };
  }

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<Contact>) {
    const contact = await this.contactRepository.findOneBy(findOptions);
    if (!contact) {
      throw new NotFoundException('contact not found');
    }
    return contact;
  }

  async findOne(id: string) {
    const contact = await this.findOneBy({ id });
    return { contact };
  }

  async update(id: string, dto: UpdateContactDto) {
    await this.findOneBy({ id });
    await this.contactRepository.update(id, dto);
    return { message: 'contact updated successfully' };
  }
}
