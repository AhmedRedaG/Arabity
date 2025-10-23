import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/typeorm/entities/user/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { PaginationQueryDto } from 'src/helper/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/helper/dto/options-query.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.serviceService.findAll(pagination, options);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const service = await this.serviceService.findOne(id);
    return { service };
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, dto);
  }
}
