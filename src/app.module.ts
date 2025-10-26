import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { AuthUtilsModule } from './auth-utils/auth-utils.module';
import { CarTypeModule } from './car-type/car-type.module';
import { CarModule } from './car/car.module';
import { ServiceModule } from './service/service.module';
import { HelperModule } from './helper/helper.module';
import { ComponentCategoryModule } from './component-category/component-category.module';
import { ComponentModule } from './component/component.module';
import { AddressCityModule } from './address-city/address-city.module';
import { AddressModule } from './address/address.module';
import { BookingModule } from './booking/booking.module';
import dbConfig from './config/db.config';
import dbProductionConfig from './config/db.production.config';
import variablesConfig from './config/variables.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, dbProductionConfig, variablesConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbProductionConfig : dbConfig,
    }),
    AuthModule,
    UserModule,
    EmailModule,
    AuthUtilsModule,
    CarTypeModule,
    CarModule,
    ServiceModule,
    HelperModule,
    ComponentCategoryModule,
    ComponentModule,
    AddressCityModule,
    AddressModule,
    BookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
