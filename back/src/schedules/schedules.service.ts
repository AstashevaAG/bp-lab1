import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import * as fs from 'fs';
import * as readline from 'readline';
@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) { }


    async searchSchedules(
        departureAirportCode?: string,
        arrivalAirportCode?: string,
        flightDate?: Date,
        flightNumber?: string,
        sortBy: Array<{ field: 'date' | 'economyPrice' | 'confirmed', order: 'asc' | 'desc' }> = [{ field: 'date', order: 'asc' }],
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
            where.date = flightDate;
        }
        if (flightNumber) {
            where.flightnumber = flightNumber;
        }


        const orderBy = sortBy.map((sortCriteria) => ({
            [sortCriteria.field]: sortCriteria.order,
        }));


        return this.prisma.schedules.findMany({
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


    async update(id: number, updateScheduleDto: UpdateScheduleDto) {
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

    async processFile(filePath: string) {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const [action, flightDate, flightNumber, departureAirport, arrivalAirport, aircraftCode, basePrice, status] = line.split(',');

            if (action === 'ADD') {
                // Логика добавления рейса
                return
            } else if (action === 'EDIT') {
                // Логика редактирования рейса
                return
            }
        }
    }
}