import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsDate,
  IsInt,
  MinLength,
} from "class-validator";
export class AuthDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, {
    message: "Password must be at least 6 characters long",
  })
  @IsString()
  password: string;

  @IsString()
  title: string;
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;

  @IsInt()
  roleId: number;

  @IsInt()
  officeId: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6, {
    message: "Password must be at least 6 characters long",
  })
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  roleId?: number;

  @IsOptional()
  @IsInt()
  officeId?: number;
}

export class CreateRoleDto {
  @IsString()
  title: string;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  title?: string;
}

export class CreateOfficeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsInt()
  countryId: number;
}

export class UpdateOfficeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsInt()
  countryId?: number;
}

export class CreateCountryDto {
  @IsString()
  name: string;
}

export class UpdateCountryDto {
  @IsOptional()
  @IsString()
  name?: string;
}
