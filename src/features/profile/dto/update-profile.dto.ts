import { IsObject, IsOptional, IsString } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  email: string = '';
  @IsOptional()
  @IsString()
  password: string = '';
  @IsOptional()
  @IsString()
  bio: string = '';
  @IsOptional()
  @IsObject()
  user: User;
}
