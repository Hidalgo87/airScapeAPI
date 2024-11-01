import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { SearchController } from './search.controller';
import { ListingsService } from '../listings/listings.service';
import { ListingsModule } from '../listings/listings.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Listing } from '../listings/entities/listing.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Listing, Booking]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    HttpModule,
    ListingsModule,
  ],
})
export class SearchModule {}
