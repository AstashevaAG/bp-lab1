import { PrismaService } from "@/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async getBookingDetails(bookingReference: string) {
    const tickets = await this.prisma.tickets.findMany({
      where: {
        bookingreference: bookingReference,
        confirmed: true,
        schedules: {
          date: {
            gte: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        schedules: {
          include: {
            routes: {
              include: {
                airports_routes_departureairportidToairports: true,
                airports_routes_arrivalairportidToairports: true,
              },
            },
          },
        },
      },
    });

    return tickets.map(ticket => ({
      flightNumber: ticket.schedules.flightnumber,
      flightDate: ticket.schedules.date,
      departure: ticket.schedules.routes.airports_routes_departureairportidToairports.name,
      arrival: ticket.schedules.routes.airports_routes_arrivalairportidToairports.name,
    }));
  }
}
