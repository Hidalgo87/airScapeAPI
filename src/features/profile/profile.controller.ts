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
  @UseInterceptors(FileInterceptor('file'))  
  update(@UploadedFile() file: File, @Body() body) {
    const updateProfileDto:UpdateProfileDto = JSON.parse(body.data);
    updateProfileDto.filePhoto = file
    return this.profileService.update(updateProfileDto);
  }
}
