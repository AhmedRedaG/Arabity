import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { ContactOptionsQueryDto } from './dto/contact-options-query.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() contactOptions: ContactOptionsQueryDto,
  ) {
    return this.contactService.findAll(pagination, contactOptions);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactService.update(id, dto);
  }
}
