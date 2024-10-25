import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { ImagesService } from '../images/images.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private imageService: ImagesService,
  ) {}

  async update(updateProfileDto: UpdateProfileDto) {
    if (!updateProfileDto.email){
      updateProfileDto.email = updateProfileDto.user.email
    }
    if (!updateProfileDto.bio){
      updateProfileDto.bio = updateProfileDto.user.bio
    }
    if (!updateProfileDto.password){
      updateProfileDto.password = updateProfileDto.user.password
    }
    const newPassword = bcryptjs.hashSync(updateProfileDto.password, 10);
    let newUser: User;
    if (updateProfileDto.photoEncoded) {
      const url = await this.imageService.updateProfilePhoto(
        updateProfileDto.photoEncoded,
        updateProfileDto.user.user_id,
      );

      newUser = this.userRepository.create({
        ...updateProfileDto.user,
        profile_picture: url,
        email: updateProfileDto.email,
        password: newPassword,
        bio: updateProfileDto.bio,
      });
    } else {
      newUser = this.userRepository.create({
        ...updateProfileDto.user,
        email: updateProfileDto.email,
        password: newPassword,
        bio: updateProfileDto.bio,
      });
    }
    const response = await this.userRepository.update(
      updateProfileDto.user.user_id,
      newUser,
    );
    return response;
  }
}
