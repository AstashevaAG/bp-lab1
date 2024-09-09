import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Auth } from '@/auth/decorators/auth.decorator';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  @Post()
  @Auth(['Administator'])
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  @Auth(['Administator', "User"])
  searchSchedules(
    @Query('departureAirportCode') departureAirportCode?: string,
    @Query('arrivalAirportCode') arrivalAirportCode?: string,
    @Query('flightDate') flightDate?: string,
    @Query('flightNumber') flightNumber?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    const parsedSortBy = sortBy ? JSON.parse(sortBy) : undefined;
    const parsedFlightDate = flightDate ? new Date(flightDate) : undefined;

    return this.schedulesService.searchSchedules(
      departureAirportCode,
      arrivalAirportCode,
      parsedFlightDate,
      flightNumber,
      parsedSortBy,
    );
  }

  @Auth(['Administator', "User"])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(+id);
  }

  @Auth(['Administator'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.update(+id, updateScheduleDto);
  }

  @Auth(['Administator'])
  @Patch(':id/status')
  toggleFlightStatus(@Param('id') id: string) {
    return this.schedulesService.toggleFlightStatus(+id);
  }

  @Auth(['Administator'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
