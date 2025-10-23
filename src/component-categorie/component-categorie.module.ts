import { Module } from '@nestjs/common';
import { ComponentCategorieService } from './component-categorie.service';
import { ComponentCategorieController } from './component-categorie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentCategory } from 'src/typeorm/entities/service/component-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentCategory])],
  controllers: [ComponentCategorieController],
  providers: [ComponentCategorieService],
})
export class ComponentCategorieModule {}
