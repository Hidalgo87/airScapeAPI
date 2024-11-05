import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/entities/user.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Body() body) {
    const user: User = body['user'];
    return this.bookingsService.findUserBookings(user);
  }

  @UseGuards(AuthGuard)
  @Patch()
  cancel(@Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.cancel(updateBookingDto);
  }
}
