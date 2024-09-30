import { instance } from "@/api/axios";
import { IUpdateScheduleForm } from "@/components/UpdateScheduleForm/UpdateScheduleForm";
import { IScheduleRow } from "@/pages/admin/Schedules/SchedulesRow";
import { IScheduleToBookRow } from "@/pages/admin/SchedulesToBook/SchedulesToBookRow";

class SchedulesService {
  private _BASE_URL = "/schedules";

  async fetchAllSchedules(
    departureAirportCode?: string,
    arrivalAirportCode?: string,
    flightNumber?: string,
    flightDate?: string,
    sortBy?: string,
    id?: number
  ) {
    const response = instance.get<{schedules: IScheduleRow[]}>(
      `${this._BASE_URL}?departureAirportCode=${departureAirportCode}&arrivalAirportCode=${arrivalAirportCode}&flightNumber=${flightNumber}&flightDate=${flightDate}&sortBy=${sortBy}&id=${id}`
    );
    return response;
  }

  async toggleSchedulesStatus(id: number) {
    return instance.put(`${this._BASE_URL}/${id}/status`);
  }

  async updateSchedule(id: number, data: IUpdateScheduleForm) {
    const response = await instance.put(`${this._BASE_URL}/${id}`, data);
    return response.data;
  }

  async importSchedules(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await instance.post(
        `/csv-upload/schedules`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async searchSchedulesToBook(
    departureAirportCode?: string,
    arrivalAirportCode?: string,
    flightDate?: string,
    returnFlightDate?: string,
    ticketClass: 'economy' | 'business' | 'first' = 'economy',
    flexibleDates: boolean = false,
    flexibleReturnDates: boolean = false,
    sortBy: 'date' | 'economyprice' | 'confirmed' | 'undefined' = 'date'
  ) {
    const response = await instance.get<{schedules: IScheduleToBookRow[], returnSchedules: IScheduleToBookRow[]}>(
      `${this._BASE_URL}?departureAirportCode=${departureAirportCode}&arrivalAirportCode=${arrivalAirportCode}&flightDate=${flightDate}&returnFlightDate=${returnFlightDate}&ticketClass=${ticketClass}&flexibleDates=${flexibleDates}&flexibleReturnDates=${flexibleReturnDates}&sortBy=${sortBy}`
    );
    return response.data;
  }
}

export default new SchedulesService();
