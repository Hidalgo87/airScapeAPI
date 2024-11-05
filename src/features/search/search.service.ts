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

  async search(searchListingDto: SearchListingDto): Promise<BriefListingDto[]> {
    return await this.searchListings(
      searchListingDto.cityName,
      searchListingDto.guestsNumber || 0,
      searchListingDto.startDate,
      searchListingDto.endDate,
    );
  }

  async searchListings(
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

    const response = await this.listingRepository
      .createQueryBuilder('listing')
      .leftJoin('listing.bookings', 'booking')
      .where('listing.maxGuests >= :guestsNumber', { guestsNumber })
      .andWhere(
        'fn_is_listing_available2 (listing.listing_id, :startDate, :endDate)',
        { status: 'pending', startDate: startDate, endDate: endDate },
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
    return this.listingsService.parseListingsToBriefListings(response);
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
