import { User } from 'src/auth/entities/user.entity';
import { Image } from 'src/features/images/interfaces/image.interface';

export class DetailsReview {
  userName: string;
  profilePicture: string;
  rating: number;
  comment: string;
}
