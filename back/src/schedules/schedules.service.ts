import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) {}

    async searchSchedules(
        departureAirportCode?: string,
        arrivalAirportCode?: string,
        flightDate?: Date,
        returnFlightDate?: Date,
        ticketClass: 'economy' | 'business' | 'first' = 'economy',
        flexibleDates: boolean = false,
        sortBy: Array<{ field: 'date' | 'economyPrice' | 'confirmed', order: 'asc' | 'desc' }> = [{ field: 'date', order: 'asc' }]
    ) {
        if (departureAirportCode && arrivalAirportCode && departureAirportCode === arrivalAirportCode) {
            throw new Error('Аэропорт отправления и прибытия не могут быть одинаковыми');
        }

        const where: any = {};

        if (departureAirportCode) {
            where.routes = {
                airports_routes_departureairportidToairports: {
                    iatacode: departureAirportCode,
                },
            };
        }

        if (arrivalAirportCode) {
            where.routes = {
                ...where.routes,
                airports_routes_arrivalairportidToairports: {
                    iatacode: arrivalAirportCode,
                },
            };
        }

        if (flightDate) {
            if (flexibleDates) {
                const startDate = new Date(flightDate);
                startDate.setDate(flightDate.getDate() - 3);

                const endDate = new Date(flightDate);
                endDate.setDate(flightDate.getDate() + 3);

                where.date = {
                    gte: startDate,
                    lte: endDate,
                };
            } else {
                where.date = flightDate;
            }
        }

        if (returnFlightDate) {
            if (returnFlightDate <= flightDate) {
                throw new Error('Обратный рейс должен быть позже даты вылета');
            }
        }

        const orderBy = sortBy.map((sortCriteria) => ({
            [sortCriteria.field]: sortCriteria.order,
        }));

        let schedules = await this.prisma.schedules.findMany({
            where,
            orderBy,
            include: {
                aircrafts: true,
                routes: {
                    include: {
                        airports_routes_departureairportidToairports: true,
                        airports_routes_arrivalairportidToairports: true,
                    },
                },
            },
        });

        schedules = schedules.map(schedule => {
            let priceMultiplier = 1;

            if (ticketClass === 'business') {
                priceMultiplier = 1.35;
            } else if (ticketClass === 'first') {
                priceMultiplier = 1.35 * 1.30;
            }

            const finalPrice = Math.floor(schedule.economyprice.toNumber() * priceMultiplier);
            return {
                ...schedule,
                finalPrice,
            };
        });

        return schedules;
    }

    async toggleFlightStatus(id: number) {
        const schedule = await this.prisma.schedules.findUnique({
            where: { id },
        });

        const newStatus = !schedule.confirmed;

        return this.prisma.schedules.update({
            where: { id },
            data: { confirmed: newStatus },
        });
    }

    async create(createScheduleDto: CreateScheduleDto) {
        return this.prisma.schedules.create({
            data: createScheduleDto,
        });
    }

    async findAll() {
        return this.prisma.schedules.findMany({
            include: {
                aircrafts: true,
                routes: {
                    include: {
                        airports_routes_departureairportidToairports: true,
                        airports_routes_arrivalairportidToairports: true,
                    },
                },
            },
        });
    }

    async findOne(id: number) {
        return this.prisma.schedules.findUnique({
            where: { id },
            include: {
                aircrafts: true,
                routes: {
                    include: {
                        airports_routes_departureairportidToairports: true,
                        airports_routes_arrivalairportidToairports: true,
                    },
                },
            },
        });
    }

    async update(id: number, updateScheduleDto: CreateScheduleDto) {
        return this.prisma.schedules.update({
            where: { id },
            data: updateScheduleDto,
        });
    }

    async remove(id: number) {
        return this.prisma.schedules.delete({
            where: { id },
        });
    }
}
