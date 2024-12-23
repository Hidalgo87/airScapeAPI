import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { JwtModule } from '@nestjs/jwt';
import { Listing } from '../listings/entities/listing.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { ListingsService } from '../listings/listings.service';
import { ImagesService } from '../images/images.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, AuthService, ListingsService, ImagesService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Booking, Listing, User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
})
export class BookingsModule {}
