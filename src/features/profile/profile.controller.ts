import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UploadedFiles, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    
  ) {}

  @UseGuards(AuthGuard)
  @Patch()
  update(@Body() updateProfileDto:UpdateProfileDto) {
    return this.profileService.update(updateProfileDto);
  }
}
