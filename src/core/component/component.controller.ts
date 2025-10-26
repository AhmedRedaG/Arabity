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
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from 'src/core/user/entities/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/dto/options-query.dto';

@Controller('components')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentService.create(createComponentDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
  ) {
    return this.componentService.findAll(pagination, options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentService.findOne(id);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
  ) {
    return this.componentService.update(id, updateComponentDto);
  }
}
