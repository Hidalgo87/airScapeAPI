import { Injectable } from '@nestjs/common';
import { SearchListingDto } from './dto/search-listing.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Listing } from '../listings/entities/listing.entity';
import { ListingsService } from '../listings/listings.service';
import { BriefListingDto } from '../listings/dto/brief-listing.dto';

@Injectable()
export class SearchService {
  constructor(
    private listingsService: ListingsService,
    private http: HttpService,
  ) {}

  async search(searchListingDto: SearchListingDto) {
    return await this.searchListings(searchListingDto.cityName, searchListingDto.guestsNumber, searchListingDto.startDate, searchListingDto.endDate);
  }

  findAll() {
    return `This action returns all search`;
  }

  findOne(id: number) {
    return `This action returns a #${id} search`;
  }

  remove(id: number) {
    return `This action removes a #${id} search`;
  }

  private async searchListings(
    cityName: string | undefined,
    guestsNumber: number | undefined,
    startDate: string = '',
    endDate: string = '',
  ): Promise<BriefListingDto[]> {
    let nearbyListings: BriefListingDto[] = [];

    if (!cityName && !guestsNumber) {
      return this.listingsService.findPopularListings();
    }

    if (cityName) {
      nearbyListings = await this.getListingsNearby(cityName);
    }

    let guestsNumberListings: BriefListingDto[] = [];

    if (guestsNumber) {
      const listings = this.listingsService.parseListingsToBriefListings(await this.listingsService.getListings());
      guestsNumberListings = listings.filter(
        (listing) => listing.maxGuests >= guestsNumber,
      );
    }

    if (!guestsNumber) {
      return nearbyListings;
    }
    if (!cityName) {
      return guestsNumberListings;
    }

    return nearbyListings.filter((nearbyListing) =>
      guestsNumberListings.some(
        (guestsNumberListing) =>
          guestsNumberListing.listingId === nearbyListing.listingId,
      ),
    );
  }

  private async getListingsNearby(cityName: string) {
    const data: any[] = await this.getLatitudeLongitude(cityName);
    ;
    let latitude = 0;
    let longitude = 0;
    data.forEach((coordinate) => {
      latitude = Number.parseFloat(coordinate.lat);
      longitude = Number.parseFloat(coordinate.lon);
    });
    const response = this.findNearbyListings(
      await this.listingsService.getListings(),
      latitude,
      longitude,
    );
    return this.listingsService.parseListingsToBriefListings(response);
  }

  private findNearbyListings(
    listings: Listing[],
    targetLat: number,
    targetLon: number,
  ): Listing[] {
    const latRange = 0.01; // Aproximadamente 0.4505 grados
    const lonRange = 0.01; // Ajusta según la latitud
    return listings.filter((listing) => {
      if (listing.latitude == null || listing.longitude == null) {
        return false;
      }
      return (
        listing.latitude >= targetLat - latRange &&
        listing.latitude <= targetLat + latRange &&
        listing.longitude >= targetLon - lonRange &&
        listing.longitude <= targetLon + lonRange
      );
    });
  }

  private async getLatitudeLongitude(
    cityName: string,
  ): Promise<{ lat: string; lon: string }[]> {
    const apiUrl = 'https://nominatim.openstreetmap.org/search';
    const params = {
      q: cityName,
      format: 'json',
      limit: '1',
      'accept-language': 'en-US',
    };

    const response = await firstValueFrom(
      this.http.get<any[]>(apiUrl, { params }).pipe(
        map((response) =>
          response.data.map((item) => ({
            lat: item.lat,
            lon: item.lon,
          })),
        ),
      ),
    );

    return response;
  }

}
