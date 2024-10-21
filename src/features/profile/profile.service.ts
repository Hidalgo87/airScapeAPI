import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
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
    updateProfileDto.password = bcryptjs.hashSync(
      updateProfileDto.password,
      10,
    );
    let newUser: User;
    if (updateProfileDto.filePhoto) {
      const url = await this.imageService.updateProfilePhoto(
        updateProfileDto.filePhoto,
        updateProfileDto.user.user_id,
      );

      newUser = this.userRepository.create({
        profile_picture: url,
        ...updateProfileDto,
      });
    } else {
      newUser = this.userRepository.create(updateProfileDto);
    }

    const response = await this.userRepository.update(
      updateProfileDto.user.user_id,
      newUser,
    );
    return response;
  }
}
