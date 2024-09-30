import { instance } from "@/api/axios";

import { IAirport } from "@/types/types";

class AirportsService {
  private _BASE_URL = "/airports";

  async fetchAllAirports() {
    return instance.get<IAirport[]>(`${this._BASE_URL}`);
  }
}

export default new AirportsService();
