import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { hash } from "argon2";
import { CreateUserDto, UpdateUserDto } from "@/auth/dto/auth.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getUsers() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        active: true,
      },
    });
  }

  async getById(id: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    // if (!user) {
    //   throw new NotFoundException(`Пользователь с email ${email} не найден`);
    // }

    return user;
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await hash(dto.password)

    return this.prisma.users.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstname: dto.firstname,
        lastname: dto.lastname,
        birthdate: dto.birthdate,
        active: dto.active ?? true,
        roleid: dto.roleId,
        officeid: dto.officeId,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const hashedPassword = dto.password ? await hash(dto.password) : undefined;

    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        email: dto.email ?? existingUser.email,
        password: hashedPassword ?? existingUser.password,
        firstname: dto.firstname ?? existingUser.firstname,
        lastname: dto.lastname ?? existingUser.lastname,
        birthdate: dto.birthdate ?? existingUser.birthdate,
        active: dto.active ?? existingUser.active,
        roleid: dto.roleId ?? existingUser.roleid,
        officeid: dto.officeId ?? existingUser.officeid,
      },
    });
  }
  async changeUserActive(id: number) {
    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        active: !existingUser.active
      },
    });
  }
}
