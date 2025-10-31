import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './core/auth/auth.module';
import { UserModule } from './core/user/user.module';
import { EmailModule } from './core/email/email.module';
import { AuthUtilsModule } from './core/auth-utils/auth-utils.module';
import { CarTypeModule } from './core/car-type/car-type.module';
import { CarModule } from './core/car/car.module';
import { ServiceModule } from './core/service/service.module';
import { UtilsModule } from './core/utils/utils.module';
import { ComponentCategoryModule } from './core/component-category/component-category.module';
import { ComponentModule } from './core/component/component.module';
import { AddressCityModule } from './core/address-city/address-city.module';
import { AddressModule } from './core/address/address.module';
import { BookingModule } from './core/booking/booking.module';
import { ReviewModule } from './core/reviews/review.module';
import { PaymentModule } from './core/payment/payment.module';
import { KashierPaymentModule } from './core/kashier-payment/kashier-payment.module';
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
    UtilsModule,
    ComponentCategoryModule,
    ComponentModule,
    AddressCityModule,
    AddressModule,
    BookingModule,
    ReviewModule,
    PaymentModule,
    KashierPaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
