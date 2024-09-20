import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ReportService {
	constructor(private prisma: PrismaService) {}

	async generateServiceReport(flightNumber?: string, flightDate?: Date) {
		const query = {
			where: {
				confirmed: true,
				schedules: {
					date: flightDate ? flightDate : { gte: new Date() },
					flightnumber: flightNumber ? flightNumber : undefined
				}
			},
			include: {
				amenitiestickets: {
					include: {
						amenities: true
					}
				},
				schedules: true
			}
		}

		const tickets = await this.prisma.tickets.findMany(query)

		const servicesReport = tickets.flatMap(ticket =>
			ticket.amenitiestickets.map(at => ({
				flightNumber: ticket.schedules.flightnumber,
				service: at.amenities.service,
				price: at.price
			}))
		)

		return servicesReport
	}
}
