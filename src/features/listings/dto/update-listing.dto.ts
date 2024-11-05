import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { Image } from 'src/features/images/interfaces/image.interface';
import { Column } from 'typeorm';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateListingDto extends CreateListingDto {
  @IsOptional()
  @IsArray()
  oldPhotos: Image[];

  @IsOptional()
  @IsString()
  listingId: string;
}
