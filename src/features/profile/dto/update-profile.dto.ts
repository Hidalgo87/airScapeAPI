import { IsObject, IsOptional, IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Image } from 'src/features/images/interfaces/image.interface';

export class UpdateProfileDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString()
  bio: string;
  @IsObject()
  user:User;
  @IsOptional()
  filePhoto: File;
}

