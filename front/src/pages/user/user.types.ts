export interface IUserSession {
  userId: number;
  loginTime: string;
  logoutTime: string;
  errorOccurred: boolean;
  errorMessage: string;
}
