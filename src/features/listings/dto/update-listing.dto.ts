import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { Image } from 'src/features/images/interfaces/image.interface';
import { Column } from 'typeorm';
import { IsString } from 'class-validator';

export class UpdateListingDto extends CreateListingDto {

	@Column('jsonb')
	photos:Image[];

	@IsString()
	listingId:string;
}
