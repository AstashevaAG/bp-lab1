import { Auth } from '@/auth/decorators/auth.decorator'
import { CurrentUser } from '@/auth/decorators/user.decorator'
import { Body, Controller, Get, Put } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth(['Administrator'])
	@Get('profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.getById(id)
	}

	@Auth(['premium'])
	@Get('premium')
	async getpremium() {
		return { text: 'premium content' }
	}

	@Auth(['admin', 'manager'])
	@Get('manager')
	async getManagerContent() {
		return { text: 'Manager content' }
	}

	@Auth(['admin'])
	@Get('list')
	async getList() {
		return this.userService.getUsers()
	}

	@Auth(['Administrator'])
	@Put()
	async changeUserActive(@Body('userId') userId: number) {
		return this.userService.changeUserActive(userId)
	}
}
