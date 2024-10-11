import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column('text')
  username: string;

  @Column('text')
  password: string;

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
    default: false,
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
