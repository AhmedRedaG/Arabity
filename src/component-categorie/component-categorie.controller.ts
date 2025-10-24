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
import { ComponentCategorieService } from './component-categorie.service';
import { CreateComponentCategorieDto } from './dto/create-component-categorie.dto';
import { UpdateComponentCategorieDto } from './dto/update-component-categorie.dto';
import { Role } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/typeorm/entities/user/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';

@Controller('component-categories')
export class ComponentCategorieController {
  constructor(
    private readonly componentCategorieService: ComponentCategorieService,
  ) {}

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  create(@Body() dto: CreateComponentCategorieDto) {
    return this.componentCategorieService.create(dto);
  }

  @Get()
  findAll() {
    return this.componentCategorieService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const categorie = await this.componentCategorieService.findOne(id);
    return { categorie };
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateComponentCategorieDto,
  ) {
    return this.componentCategorieService.update(id, dto);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.componentCategorieService.remove(id);
  }
}
