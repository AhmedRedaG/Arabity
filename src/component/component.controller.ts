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
import { Role } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { PaginationQueryDto } from 'src/helper/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/helper/dto/options-query.dto';

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
  async findOne(@Param('id') id: string) {
    const component = await this.componentService.findOne(id);
    return { component };
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
