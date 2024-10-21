import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/entities/user.entity';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() createListingDto: CreateListingDto
  ) {
    this.listingsService.create(createListingDto);
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
  @Get('/user')
  findUserListings(@Body() body) {
    const user:User = body['user'];
    return this.listingsService.findUserListings(user);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Body() updateListingDto: UpdateListingDto) {
    return this.listingsService.update(updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}
