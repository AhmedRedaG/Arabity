import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ComponentCategoryService } from './component-category.service';
import { CreateComponentCategoryDto } from './dto/create-component-category.dto';
import { UpdateComponentCategoryDto } from './dto/update-component-category.dto';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from 'src/core/user/entities/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('component-categories')
export class ComponentCategoryController {
  constructor(
    private readonly componentCategoryService: ComponentCategoryService,
  ) {}

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() dto: CreateComponentCategoryDto) {
    return this.componentCategoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.componentCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.componentCategoryService.findOne(id);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateComponentCategoryDto,
  ) {
    return this.componentCategoryService.update(id, dto);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.componentCategoryService.remove(id);
  }
}
