import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('services')
  async getServiceReport(
    @Query('flightNumber') flightNumber?: string,
    @Query('flightDate') flightDate?: string
  ) {
    const date = flightDate ? new Date(flightDate) : undefined;

    const report = await this.reportService.generateServiceReport(flightNumber, date);

    return report;
  }
}
