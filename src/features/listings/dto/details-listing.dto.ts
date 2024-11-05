import { User } from 'src/auth/entities/user.entity';
import { Image } from 'src/features/images/interfaces/image.interface';
import { Review } from 'src/features/reviews/entities/review.entity';

export class DetailsListingDto {
	listing_id: string;
	title: string;
	photos: Image[];
	description: string;
	address: string;
	latitude: number;
	longitude: number;
	pricePerNight: number;
	numBedrooms: number;
	numBathrooms: number;
	maxGuests: number;
	ownerName: string;
	ownerPicture: string;
	createdAt: Date;
	updatedAt: Date;
	reviews: Review[];
}
