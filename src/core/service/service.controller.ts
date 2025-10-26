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
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from 'src/core/user/entities/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/dto/options-query.dto';
import { ComponentService } from 'src/core/component/component.service';

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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.findOne(id);
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

  /////// find related components

  @Get(':serviceId/components')
  findComponents(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.componentService.findAll(pagination, options, {
      category: {
        services: {
          id: serviceId,
        },
      },
    });
  }

  @Get(':serviceId/categories/:categoryId/components')
  findComponentsByCategory(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.componentService.findAll(pagination, options, {
      category: {
        id: categoryId,
        services: {
          id: serviceId,
        },
      },
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
      carTypes: {
        id: carTypeId,
      },
      category: {
        services: {
          id: serviceId,
        },
      },
    });
  }

  @Get(':serviceId/car-types/:carTypeId/categories/:categoryId/components')
  findComponentsByCarTypeAndCategory(
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Param('carTypeId', ParseUUIDPipe) carTypeId: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.componentService.findAll(pagination, options, {
      carTypes: {
        id: carTypeId,
      },
      category: {
        id: categoryId,
        services: {
          id: serviceId,
        },
      },
    });
  }
}
