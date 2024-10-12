import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';
import { Listing } from './entities/listing.entity';
import { ImagesService } from '../images/images.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [ListingsController],
  providers: [ListingsService, ImagesService, AuthService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Listing, User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class ListingsModule {}