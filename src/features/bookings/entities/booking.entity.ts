import { User } from 'src/auth/entities/user.entity';
import { Listing } from 'src/features/listings/entities/listing.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  booking_id: string;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Listing, (listing) => listing.bookings)
  listing: Listing;

  @Column({
    type: 'date',
  }) // Saves The Time Zone, So saves a general date for everywhere
  start_date: Date;

  @Column({
    type: 'date',
  }) // Saves The Time Zone, So saves a general date for everywhere
  end_date: Date;

  @Column()
  total_price: number;

  @Column({ type: 'text', default: 'pending' })
  status: string;

  @Column({
    type: 'timestamptz',
    default: new Date(),
  }) // Saves The Time Zone, So saves a general date for everywhere
  created_at: Date;
}
