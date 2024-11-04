import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Image } from 'src/features/images/interfaces/image.interface';
import { User } from 'src/auth/entities/user.entity';
import { Booking } from 'src/features/bookings/entities/booking.entity';
import { Review } from 'src/features/reviews/entities/review.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  listing_id: string;

  @ManyToOne(() => User, (user) => user.listings)
  user: User;

  @OneToMany(() => Booking, (booking) => booking.listing)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.listing)
  reviews: Review[];

  @Column({
    type: 'text',
  })
  title: string;

  @Column('jsonb') // Guardamos las imágenes como un array de objetos
  photos: Image[];

  @Column('text')
  description: string;

  @Column({
    type: 'text',
  })
  address: string;

  @Column('decimal', { precision: 9, scale: 6 }) // Para latitud
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6 }) // Para longitud
  longitude: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight: number;

  @Column('int')
  numBedrooms: number;

  @Column('int')
  numBathrooms: number;

  @Column('int')
  maxGuests: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: new Date(),
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: new Date(),
  })
  updatedAt: Date;

  @Column({ type: 'float4', default: null, nullable: true })
  rating: number;
}
