import { PartialType } from '@nestjs/mapped-types';
import { CreateComponentCategoryDto } from './create-component-category.dto';

export class UpdateComponentCategoryDto extends PartialType(
  CreateComponentCategoryDto,
) {}
