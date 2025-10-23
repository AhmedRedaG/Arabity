import { PartialType } from '@nestjs/mapped-types';
import { CreateComponentCategorieDto } from './create-component-categorie.dto';

export class UpdateComponentCategorieDto extends PartialType(
  CreateComponentCategorieDto,
) {}
