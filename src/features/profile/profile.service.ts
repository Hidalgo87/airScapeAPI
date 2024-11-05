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

  async update(updateProfileDto: UpdateProfileDto, file: Express.Multer.File) {
    if (!updateProfileDto.email) {
      updateProfileDto.email = updateProfileDto.user.email;
    }
    if (!updateProfileDto.bio) {
      updateProfileDto.bio = updateProfileDto.user.bio;
    }
    let newPassword = bcryptjs.hashSync(updateProfileDto.password, 10);
    if (!updateProfileDto.password) {
      const oldPass = await this.userRepository.find({
        select: { password: true },
        where: { user_id: updateProfileDto.user.user_id },
      });
      newPassword = oldPass[0].password;
    }
    let newUser: User;
    if (file) {
      const url = await this.imageService.updateProfilePhoto(
        file,
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
    return newUser;
  }
}
