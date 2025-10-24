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
import { ComponentService } from 'src/component/component.service';

@Controller('services')
export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly componentService: ComponentService,
  ) {}

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

  @Get(':id/components')
  findComponents(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.componentService.findAll(pagination, options, {
      service: { id },
    });
  }

  @Get(':serviceId/car-types/:carTypeId/components')
  findComponentsByCarType(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Param('carTypeId', ParseUUIDPipe) carTypeId: string,
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.componentService.findAll(pagination, options, {
      service: { id: serviceId },
      carTypes: { id: carTypeId },
    });
  }

  @Get(':serviceId/car-types/:carTypeId/categories/:categorieId/components')
  findComponentsByCarTypeAndCategorie(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Param('carTypeId', ParseUUIDPipe) carTypeId: string,
    @Param('categorieId', ParseUUIDPipe) categorieId: string,
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.componentService.findAll(pagination, options, {
      service: { id: serviceId },
      carTypes: { id: carTypeId },
      category: { id: categorieId },
    });
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
