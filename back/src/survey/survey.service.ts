import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import * as fs from 'fs'
import * as csv from 'fast-csv'

@Injectable()
export class SurveyService {
	constructor(private prisma: PrismaService) {}

	async loadCsvData(filePath: string): Promise<void> {
		const stream = fs.createReadStream(filePath)
		const surveys: any[] = []

		return new Promise((resolve, reject) => {
			stream
				.pipe(csv.parse({ headers: true }))
				.on('data', async row => {
					const survey = {
						departure: row['Departure'],
						arrival: row['Arrival'],
						age: parseInt(row['Age']),
						gender: row['Gender'],
						cabinType: row['CabinType'],
						q1: parseInt(row['Q1']),
						q2: parseInt(row['Q2']),
						q3: parseInt(row['Q3']),
						q4: parseInt(row['Q4'])
					}
					surveys.push(survey)
				})
				.on('end', async () => {
					await this.prisma.survey.createMany({ data: surveys })
					resolve()
				})
				.on('error', error => reject(error))
		})
	}

	async getSurveyStats() {
		const genderStats = await this.getStatsByField('gender')

		const ageStats = await this.getStatsByField('age')

		const cabinTypeStats = await this.getStatsByField('cabinType')

		const departureStats = await this.getStatsByField('departure')

		const arrivalStats = await this.getStatsByField('arrival')

		return {
			gender: genderStats,
			age: ageStats,
			cabinType: cabinTypeStats,
			departure: departureStats,
			arrival: arrivalStats
		}
	}

	async getStatsByField(
		field: 'gender' | 'age' | 'cabinType' | 'departure' | 'arrival'
	) {
		const surveys = await this.prisma.survey.groupBy({
			by: [field],
			_sum: {
				q1: true,
				q2: true,
				q3: true,
				q4: true
			},
			_count: {
				q1: true,
				q2: true,
				q3: true,
				q4: true
			}
		})

		const result = surveys.map(group => ({
			[field]: group[field],
			q1: group._sum.q1 || 0,
			q2: group._sum.q2 || 0,
			q3: group._sum.q3 || 0,
			q4: group._sum.q4 || 0,
			count: group._count.q1 || 0
		}))

		return result
	}
}
