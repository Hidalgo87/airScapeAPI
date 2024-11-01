import { Injectable } from '@nestjs/common';
import { SearchListingDto } from './dto/search-listing.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Listing } from '../listings/entities/listing.entity';
import { ListingsService } from '../listings/listings.service';
import { BriefListingDto } from '../listings/dto/brief-listing.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private listingsService: ListingsService,
    private http: HttpService,
  ) {}

  async search(searchListingDto: SearchListingDto) {
    return await this.searchListings(
      searchListingDto.cityName,
      searchListingDto.guestsNumber,
      searchListingDto.startDate,
      searchListingDto.endDate,
    );
  }

  async searchListingsAlternative(
    cityName: string | undefined,
    guestsNumber: number | undefined,
    startDate: string = '2020-03-4',
    endDate: string = '2020-03-5',
  ) {
    const data: any[] = await this.getLatitudeLongitude(cityName);
    let latitude = 0;
    let longitude = 0;
    data.forEach((coordinate) => {
      latitude = Number.parseFloat(coordinate.lat);
      longitude = Number.parseFloat(coordinate.lon);
    });
    console.log('latitude', latitude);
    console.log('longitude', longitude);
    // Here, you're gona do a method to replace the searchListings( method

    const response = await this.listingRepository
      .createQueryBuilder('listing')
      .leftJoin('listing.bookings', 'booking')
      .where('listing.maxGuests >= :guestsNumber', { guestsNumber })
      .andWhere(
        '((booking.status = :pendingStr AND (booking.start_date > :endDate OR booking.end_date < :startDate)) OR booking.booking_id IS NULL)', // Permitir listings sin bookings
        { pendingStr: 'pending', startDate, endDate },
      )
      .andWhere('listing.latitude BETWEEN :minLat AND :maxLat', {
        minLat: latitude - 0.01,
        maxLat: latitude + 0.01,
      })
      .andWhere('listing.longitude BETWEEN :minLong AND :maxLong', {
        minLong: longitude - 0.01,
        maxLong: longitude + 0.01,
      })
      .setParameters({ latitude, longitude, guestsNumber }) // Asegúrate de que 'latitude' y 'longitude' están definidas
      .getMany();

    console.log('response', response.length);
    return response;
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
      const listings = this.listingsService.parseListingsToBriefListings(
        await this.listingsService.getListings(),
      );
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
      this.http
        .get<any[]>(apiUrl, {
          params,
          headers: {
            'User-Agent': 'airScape/1.0 (juan@gmail.com)', // Cambia esto por tu información
          },
        })
        .pipe(
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
