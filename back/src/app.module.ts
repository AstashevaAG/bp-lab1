import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { RoleModule } from './role/role.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		AuthModule,
		UserModule,
		RoleModule,
		SchedulesModule
	]
})
export class AppModule {}
