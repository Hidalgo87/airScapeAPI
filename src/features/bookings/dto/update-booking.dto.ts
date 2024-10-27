import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsObject, IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class UpdateBookingDto {
  @IsString()
  startDate: string = '';

  @IsString()
  endDate: string = '';

  @IsString()
  bookingId: string;

  @IsObject()
  user:User;

  @IsString()
  status:string = '';
}
