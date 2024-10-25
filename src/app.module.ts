import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsModule } from './features/listings/listings.module';
import { SearchModule } from './features/search/search.module';
import { ProfileModule } from './features/profile/profile.module';


@Module({
  imports: [HttpModule,
            ConfigModule.forRoot(), 
            TypeOrmModule.forRoot({
              type:'postgres',
              host:process.env.AP_DB_HOST,
              port:+process.env.AP_DB_PORT,
              database:process.env.AP_DB_NAME,
              username:process.env.AP_DB_USER,
              password:process.env.AP_DB_PASSWORD,
              autoLoadEntities:true,
              synchronize:true
            })
    , AuthModule, ListingsModule, SearchModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
