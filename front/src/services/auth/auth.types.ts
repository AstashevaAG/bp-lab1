export enum UserRole {
	USER = 'User',
	ADMIN = 'Administrator'
}

export interface ITokenInside {
	id: number
	roleid: number
	iat: number
	exp: number
}

export type TProtectUserData = Omit<ITokenInside, 'iat' | 'exp'>
