import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Not, Repository } from 'typeorm';
import { ListingsService } from '../listings/listings.service';
import { User } from 'src/auth/entities/user.entity';
import { Listing } from '../listings/entities/listing.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private listingsService: ListingsService,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
    const listing: Listing = await this.listingsService.getListingById(
      createBookingDto.listingId,
    );
    const response = await this.bookingRepository.query(
      'SELECT fn_is_listing_available2 ($1::uuid, $2::date, $3::date) as r',
      [
        listing.listing_id,
        createBookingDto.startDate,
        createBookingDto.endDate,
      ],
    );
    const isAvailable = response[0].r;
    if (!isAvailable) {
      throw new HttpException(
        'The listing is already booked in that dates',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      let newBooking = this.bookingRepository.create({
        total_price:
          listing.pricePerNight *
          this.calculateDaysBetween(
            new Date(createBookingDto.startDate),
            new Date(createBookingDto.endDate),
          ),
        start_date: createBookingDto.startDate,
        end_date: createBookingDto.endDate,
        listing,
        user: createBookingDto.user,
      });
      await this.bookingRepository.save(newBooking);
    } catch (error) {
      throw new InternalServerErrorException('Something was wrong :(', error);
    }
  }

  async findUserBookings(user: User) {
    const bookings: Booking[] = await this.bookingRepository.find({
      where: { user },
    });
    return bookings;
  }

  async cancel(updateBookingDto: UpdateBookingDto) {
    const oldBooking = await this.getBookingById(updateBookingDto.bookingId);

    let newBooking = this.bookingRepository.create({
      ...oldBooking,
      status: 'canceled',
    });
    const response = await this.bookingRepository.update(
      updateBookingDto.bookingId,
      newBooking,
    );
    return response;
  }

  private async getBookingById(bookingId: string) {
    return await this.bookingRepository.findOne({
      where: { booking_id: bookingId },
      relations: ['listing'],
    });
  }

  private calculateDaysBetween(startDate: Date, endDate: Date): number {
    if (startDate > endDate) {
      throw new HttpException(
        'La fecha de inicio debe ser anterior a la fecha de fin',
        HttpStatus.BAD_REQUEST,
      );
    }

    const diffTime = endDate.getTime() - startDate.getTime();

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
