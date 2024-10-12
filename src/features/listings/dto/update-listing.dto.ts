import { PartialType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { Image } from 'src/features/images/interfaces/image.interface';
import { Column } from 'typeorm';

export class UpdateListingDto extends PartialType(CreateListingDto) {

	@Column('jsonb')
	photos:Image[];
}
