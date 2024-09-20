import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get(':bookingReference/details')
  async getBookingDetails(@Param('bookingReference') bookingReference: string) {
    const bookingDetails = await this.bookingService.getBookingDetails(bookingReference);

    if (!bookingDetails || bookingDetails.length === 0) {
      throw new NotFoundException('No booking found or all flights are within 24 hours.');
    }

    return bookingDetails;
  }
}
