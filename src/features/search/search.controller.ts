import { Controller, Post, Body } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchListingDto } from './dto/search-listing.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  create(@Body() searchListingDto: SearchListingDto) {
    return this.searchService.search(searchListingDto);
  }
}
