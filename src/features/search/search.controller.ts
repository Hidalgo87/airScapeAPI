import { Controller, Post, Body } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchListingDto } from './dto/search-listing.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  create(@Body() searchListingDto: SearchListingDto) {
    if (
      !searchListingDto.cityName &&
      !searchListingDto.guestsNumber &&
      !searchListingDto.startDate &&
      !searchListingDto.endDate
    ) {
      return this.searchService.getPopularListings();
    } else {
      return this.searchService.search(searchListingDto);
    }
  }
}
