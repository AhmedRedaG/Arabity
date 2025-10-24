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
import { ComponentCategorieModule } from './component-categorie/component-categorie.module';
import { ComponentModule } from './component/component.module';
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
    ComponentCategorieModule,
    ComponentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
