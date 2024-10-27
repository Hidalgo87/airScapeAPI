import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { ListingsService } from '../listings/listings.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private listingsService: ListingsService,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
    const listing = (await this.listingsService.getListings()).find(
      (listing) => listing.listing_id === createBookingDto.listingId,
    );
    let newBooking = this.bookingRepository.create({
      total_price: 6,
      start_date: createBookingDto.startDate,
      end_date: createBookingDto.endDate,
      listing,
      user: createBookingDto.user,
    });
    await this.bookingRepository.save(newBooking);
    try {
    } catch (error) {}
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
    });
  }
}
