import { IsNumber, IsObject, IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class CreateReviewDto {
  @IsString()
  listingId;

  @IsNumber()
  rating;

  @IsString()
  comment;

  @IsObject()
  user: User;
}
