import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Listing } from '../listings/entities/listing.entity';
import { User } from 'src/auth/entities/user.entity';
import { ListingsService } from '../listings/listings.service';
import { ImagesService } from '../images/images.service';
import { Review } from './entities/review.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, AuthService, ListingsService, ImagesService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Review, Listing, User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
