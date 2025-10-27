import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/core/service/entities/service.entity';
import { ComponentModule } from 'src/core/component/component.module';
import { ComponentCategoryModule } from 'src/core/component-category/component-category.module';
import { ReviewModule } from '../reviews/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    ComponentModule,
    ComponentCategoryModule,
    ReviewModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
