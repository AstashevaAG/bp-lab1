import { instance } from "@/api/axios";

import { IOffice } from "@/types/types";

class OfficesService {
  private _BASE_URL = "/offices";

  async fetchAllOffices() {
    return instance.get<IOffice[]>(`${this._BASE_URL}`);
  }
}

export default new OfficesService();
