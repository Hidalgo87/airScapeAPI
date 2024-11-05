import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/entities/user.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { EwitsGuard } from 'src/auth/guards/ewits.guard';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(EwitsGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createListingDto: any,
    @Req() req: any,
  ) {
    let {
      latitude,
      longitude,
      pricePerNight,
      numBedrooms,
      numBathrooms,
      oldPhotos,
      ...listingData
    } = createListingDto;

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    pricePerNight = parseFloat(pricePerNight);
    numBedrooms = parseInt(numBedrooms, 10);
    numBathrooms = parseInt(numBathrooms, 10);

    let parsedOldPhotos;
    try {
      parsedOldPhotos = JSON.parse(oldPhotos);
    } catch (e) {
      parsedOldPhotos = [];
    }

    const updatedCreateListingDto = {
      ...listingData,
      latitude,
      longitude,
      pricePerNight,
      numBedrooms,
      numBathrooms,
      oldPhotos: parsedOldPhotos,
    };

    const user = req.user;
    updatedCreateListingDto.user = user;
    updatedCreateListingDto.files = files;

    return this.listingsService.create(updatedCreateListingDto);
  }

  @Get()
  findPopularListings() {
    return this.listingsService.findPopularListings();
  }

  @UseGuards(AuthGuard)
  @Get('/details/:id')
  findOneListing(@Param('id') id: string) {
    return this.listingsService.findListingDetails(id);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  findOneRawListing(@Param('id') id: string) {
    return this.listingsService.findRawListing(id);
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  findUserListings(@Body() body) {
    const user: User = body['user'];
    return this.listingsService.findUserListings(user);
  }

  @UseGuards(EwitsGuard)
  @Patch()
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateBody: any,
    @Req() req: any,
  ) {
    let {
      latitude,
      longitude,
      pricePerNight,
      numBedrooms,
      numBathrooms,
      oldPhotos,
      ...updateListingDto
    } = updateBody;
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    pricePerNight = parseFloat(pricePerNight);
    numBedrooms = parseInt(numBedrooms, 10);
    numBathrooms = parseInt(numBathrooms, 10);

    let parsedOldPhotos;
    try {
      parsedOldPhotos = JSON.parse(oldPhotos);
    } catch (e) {
      parsedOldPhotos = [];
    }

    updateListingDto = {
      ...updateListingDto,
      latitude,
      longitude,
      pricePerNight,
      numBedrooms,
      numBathrooms,
      oldPhotos: parsedOldPhotos,
    };
    const user = req.user;
    updateListingDto.user = user;
    updateListingDto.files = files;
    return this.listingsService.update(updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}
