import { IsObject, IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class CreateBookingDto {
  @IsString()
  listingId: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsObject()
  user: User;
}
