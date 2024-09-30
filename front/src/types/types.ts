export interface IUser {
  id: number;
  name?: string;
  email: string;
  avatarPath?: string;
  verificationToken?: string;
  roleid: number;
  title: string;
  firstname: string;
  lastname: string;
  officeId: string;
}

export interface IFormData extends Pick<IUser, "email"> {
  password: string;
  title: string;
  firstname: string;
  lastname: string;
  roleId: string;
  officeId: string;
}

export interface IOffice {
  id: number;
  countryId: number;
  title: string;
  phone: string;
  contact: string;
}

export interface IAirport {
  id: number;
  countryId: number;
  iatacode: string;
  name: string;
}
