import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { SearchController } from './search.controller';
import { ListingsService } from '../listings/listings.service';
import { ListingsModule } from '../listings/listings.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [ HttpModule, ListingsModule],
})
export class SearchModule {}
