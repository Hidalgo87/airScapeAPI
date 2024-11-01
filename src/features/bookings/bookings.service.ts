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
    if (
      !(await this.isAvailable(
        listing,
        createBookingDto.startDate,
        createBookingDto.endDate,
        '',
      ))
    ) {
      throw new HttpException(
        'The listing is already booked in that dates',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      let newBooking = this.bookingRepository.create({
        total_price: 6, // TODO: NO QUEMARLO
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

  async update(updateBookingDto: UpdateBookingDto) {
    const oldBooking = await this.getBookingById(updateBookingDto.bookingId);
    if (!updateBookingDto.startDate) {
      updateBookingDto.startDate = oldBooking.start_date.toString();
    }
    if (!updateBookingDto.endDate) {
      updateBookingDto.endDate = oldBooking.end_date.toString();
    }
    if (!updateBookingDto.status) {
      updateBookingDto.status = oldBooking.status;
    }
    if (
      !(await this.isAvailable(
        oldBooking.listing,
        updateBookingDto.startDate,
        updateBookingDto.endDate,
        updateBookingDto.bookingId,
      ))
    ) {
      throw new HttpException(
        'The listing is already booked in that dates',
        HttpStatus.BAD_REQUEST,
      );
    }
    let newBooking = this.bookingRepository.create({
      ...oldBooking,
      start_date: updateBookingDto.startDate,
      end_date: updateBookingDto.endDate,
      status: updateBookingDto.status,
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

  private async isAvailable(
    listing: Listing,
    startDateStr: string,
    endDateStr: string,
    bookingId: string = '',
  ): Promise<boolean> {
    try {
      let startDate = new Date(startDateStr);
      let endDate = new Date(endDateStr);
      let bookings: Booking[] = [];
      if (bookingId) {
        bookings = await this.bookingRepository.findBy({
          listing: { listing_id: listing.listing_id },
          booking_id: Not(bookingId),
          status: 'pending',
        });
      } else {
        bookings = await this.bookingRepository.findBy({
          listing: { listing_id: listing.listing_id },
          status: 'pending',
        });
      }
      for (let booking of bookings) {
        const bookingStartDate = new Date(booking.start_date);
        const bookingEndDate = new Date(booking.end_date);
        if (
          endDate.getTime() >= bookingStartDate.getTime() &&
          startDate.getTime() <= bookingEndDate.getTime()
        ) {
          return Promise.resolve(false);
        }
      }
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Something was wrong :( ${error}`,
        error,
      );
    }
  }
}
