import {
  IsString,
  IsNumber,
  IsArray,
  IsPositive,
  Min,
  IsObject,
  IsOptional,
} from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class CreateListingDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsArray()
  files: Express.Multer.File[];

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @IsPositive()
  pricePerNight: number;

  @IsNumber()
  @Min(0)
  numBedrooms: number;

  @IsNumber()
  @Min(0)
  numBathrooms: number;

  @IsNumber()
  @IsPositive()
  maxGuests: number;

  @IsObject()
  user: User;
}
