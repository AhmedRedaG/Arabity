import { Module } from '@nestjs/common';
import { ComponentCategoryService } from './component-category.service';
import { ComponentCategoryController } from './component-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentCategory } from 'src/typeorm/entities/service/component-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentCategory])],
  controllers: [ComponentCategoryController],
  providers: [ComponentCategoryService],
  exports: [ComponentCategoryService],
})
export class ComponentCategoryModule {}
