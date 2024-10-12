import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createListingDto: CreateListingDto
  ) {
    console.log('createListingDto', createListingDto);
    return this.listingsService.create(createListingDto);
  }

  @Get()
  findPopularListings() {
    return this.listingsService.findPopularListings();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOneListing(@Param('id') id: string) {
    return this.listingsService.findOneListing(id);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  findUserListings(@Param('id') id: string) {
    return this.listingsService.findUserListings(id);
  }

  @Patch(':id')
  update(@Param('id') listing_id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingsService.update(listing_id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(+id);
  }
}
