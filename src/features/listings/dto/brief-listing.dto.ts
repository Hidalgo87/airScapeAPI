import { User } from 'src/auth/entities/user.entity';
import { Image } from 'src/features/images/interfaces/image.interface';

export class BriefListingDto {
	listingId: string;
	title: string;
	photo:Image;
	pricePerNight: number;
	calification:number;
	maxGuests: number;
	createdAt: Date;  
 	user: User;
}
