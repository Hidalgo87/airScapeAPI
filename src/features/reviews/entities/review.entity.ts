import { User } from 'src/auth/entities/user.entity';
import { Listing } from 'src/features/listings/entities/listing.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  review_id: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Listing, (listing) => listing.reviews)
  listing: Listing;

  @Column('float4')
  rating: number;

  @Column('text')
  comment: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: new Date(),
  })
  createdAt: Date;
}
