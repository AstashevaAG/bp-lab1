import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { PrismaService } from '@/prisma.service';
import { RoleService } from '@/role/role.service';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, PrismaService, RoleService],
})
export class SchedulesModule {}
