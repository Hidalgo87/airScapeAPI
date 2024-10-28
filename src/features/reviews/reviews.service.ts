import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const newReview = this.reviewRepository.create({
        listing: { listing_id: createReviewDto.listingId },
        ...createReviewDto,
      });
      await this.reviewRepository.save(newReview);
    } catch (error) {
      throw new InternalServerErrorException(
        `Something was wrong :( ${error}`,
        error,
      );
    }
  }

  async findReviewsByListingId(listingId: string) {
    return await this.reviewRepository.find({
      where: { listing: { listing_id: listingId } },
    });
  }
}
