import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/typeorm/entities/service/service.entity';
import { ComponentModule } from 'src/component/component.module';

@Module({
  imports: [TypeOrmModule.forFeature([Service]), ComponentModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
