import { forwardRef, Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from 'src/typeorm/entities/service/component.entity';
import { ServiceModule } from 'src/core/service/service.module';
import { ComponentCategoryModule } from 'src/core/component-category/component-category.module';
import { CarTypeModule } from 'src/core/car-type/car-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Component]),
    forwardRef(() => ServiceModule),
    ComponentCategoryModule,
    CarTypeModule,
  ],
  controllers: [ComponentController],
  providers: [ComponentService],
  exports: [ComponentService],
})
export class ComponentModule {}
