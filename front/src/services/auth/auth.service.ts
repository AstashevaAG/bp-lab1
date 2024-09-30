import { axiosClassic, instance } from "@/api/axios";
import { IFormData, IUser } from "@/types/types";
import { removeFromStorage, saveTokenStorage } from "./auth.helper";

interface IAuthResponse {
  accessToken: string;
  user: IUser;
}

interface ICreateUser {
  email: string;
  firstname: string;
  lastname: string;
  officeId: number;
  birthdate: Date;
  title: string;
  password: string;
}

export enum EnumTokens {
  "ACCESS_TOKEN" = "accessToken",
  "REFRESH_TOKEN" = "refreshToken",
}

class AuthService {
  async createUser(userData: ICreateUser) {
    const response = await axiosClassic.post("/auth/register", userData);
    return response.data;
  }

  async main(type: "login" | "register", data: IFormData) {
    const response = await axiosClassic.post<IAuthResponse>(
      `/auth/${type}`,
      data
    );

    if (response.data.accessToken) saveTokenStorage(response.data.accessToken);

    return response;
  }

  async getNewTokens() {
    const response =
      await axiosClassic.post<IAuthResponse>("/auth/access-token");

    if (response.data.accessToken) saveTokenStorage(response.data.accessToken);

    return response;
  }

  async getNewTokensByRefresh(refreshToken: string) {
    const response = await axiosClassic.post<IAuthResponse>(
      "/auth/access-token",
      {},
      {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      }
    );

    return response.data;
  }

  async logout() {
    const response = await instance.post<boolean>("/auth/logout");

    if (response.data) removeFromStorage();

    return response;
  }
}

export default new AuthService();
