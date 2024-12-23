import { Booking } from 'src/features/bookings/entities/booking.entity';
import { Listing } from 'src/features/listings/entities/listing.entity';
import { Review } from 'src/features/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(() => Listing, listing => listing.user)
  listings: Listing[];

  @OneToMany(() => Booking, booking => booking.user)
  bookings: Booking[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @Column({
    type: 'text',
    default:
      'https://img.freepik.com/premium-vector/stylish-default-user-profile-photo-avatar-vector-illustration_664995-352.jpg?semt=ais_hybrid',
  })
  profile_picture: string;

  @Column({
    type: 'text',
    default: 'Please update here your bio',
  })
  bio: string;

  @Column({
    type: 'boolean',
  })
  is_owner: boolean;

  @Column({
    type: 'timestamptz',
    default: new Date(),
  }) // Saves The Time Zone, So saves a general date for everywhere
  created_at: Date;

  @Column({
    type: 'timestamptz',
    default: new Date(),
  })
  updated_at: Date;
}
