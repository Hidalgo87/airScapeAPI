import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { EwitsGuard } from 'src/auth/guards/ewits.guard';
import { AuthService } from 'src/auth/auth.service';
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private authService: AuthService,
  ) {}

  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(EwitsGuard)
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: any,
  ) {
    const user = req.user;
    updateProfileDto.user = user;
    return this.profileService.update(updateProfileDto, file);
  }
}
