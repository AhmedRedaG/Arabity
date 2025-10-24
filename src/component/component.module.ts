import { forwardRef, Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from 'src/typeorm/entities/service/component.entity';
import { ServiceModule } from 'src/service/service.module';
import { ComponentCategorieModule } from 'src/component-categorie/component-categorie.module';
import { CarTypeModule } from 'src/car-type/car-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Component]),
    forwardRef(() => ServiceModule),
    ComponentCategorieModule,
    CarTypeModule,
  ],
  controllers: [ComponentController],
  providers: [ComponentService],
  exports: [ComponentService],
})
export class ComponentModule {}
