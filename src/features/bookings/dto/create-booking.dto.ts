import { IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  listingId: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
