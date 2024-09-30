import { instance } from "@/api/axios";
import { IUpdateUserForm } from "@/components/UpdateUserForm/UpdateUserForm";
import { IUpdateUserSessionForm } from "@/components/UpdateUserSessionForm/UpdateUserSessionForm";
import { IUserErrorSessions } from "@/pages/admin/Sessions/SessionRow";
import { IUserRow } from "@/pages/admin/Users/UsersRow";
import { IUserSession } from "@/pages/user/user.types";
import { IUser } from "@/types/types";

class UserService {
  private _BASE_URL = "/users";

  async fetchProfile() {
    return instance.get<IUser>(`${this._BASE_URL}/profile`);
  }
  async getById(id: number) {
    return instance.get<IUpdateUserForm>(`${this._BASE_URL}/by-id/${id}`);
  }

  async fetchPremium() {
    return instance.get<{ text: string }>(`${this._BASE_URL}/premium`);
  }

  async fetchManagerContent() {
    return instance.get<{ text: string }>(`${this._BASE_URL}/manager`);
  }

  async fetchList(officeId?: number) {
    let url = this._BASE_URL + `/list?officeId=${officeId}`;
    return instance.get<IUserRow[]>(url);
  }

  async getUserSessions() {
    const response = await instance.get<IUserSession[]>("/users/sessions");

    return response.data;
  }
  async getAllSessions(id?: number, errorOccured?: boolean) {
    const response = await instance.get<IUserErrorSessions[]>(`/users/sessions/all?id=${id}&errorOccured=${errorOccured}`);

    return response.data;
  }

  async updateUser(id: number, data: IUpdateUserForm) {
    const response = await instance.put<IUpdateUserForm>(`/users/${id}`, data);

    return response.data;
  }
  async updateUserSession(id: number, data: IUpdateUserSessionForm) {
    const response = await instance.put<IUpdateUserSessionForm>(`/users/sessions/${id}`, data);

    return response.data;
  }


  async activateUser(id: number) {
    const response = await instance.put<IUser>(`/users/${id}/activate`);

    return response.data;
  }

  async getUserSessionsCrashes() {
    const response = await instance.get("/users/sessions/crashes");

    return response.data;
  }
  async getUserSessionsTime() {
    const response = await instance.get("/users/sessions/total-time");

    return response.data;
  }
  async getUserProfile() {
    const response = await instance.get<IUser>("/users/profile");

    return response.data;
  }
}

export default new UserService();
