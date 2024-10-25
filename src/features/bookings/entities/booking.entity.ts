import { User } from 'src/auth/entities/user.entity';
import { Listing } from 'src/features/listings/entities/listing.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Booking {
  @PrimaryGeneratedColumn('uuid')
  booking_id: string;


  @Column({
    type: 'timestamptz',
  }) // Saves The Time Zone, So saves a general date for everywhere
  start_date: Date;

  @Column({
    type: 'timestamptz',
  }) // Saves The Time Zone, So saves a general date for everywhere
  end_date: Date;

  @Column()
  total_price: number;

  @Column({
    type: 'timestamptz',
    default: new Date(),
  }) // Saves The Time Zone, So saves a general date for everywhere
  created_at: Date;
}
