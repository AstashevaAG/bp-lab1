import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "./SchedulesToBook.module.scss";
import Button from "@/ui/Button/Button";
import LogoutButton from "@/ui/LogoutButton/LogoutButton";
import SchedulesToBookRow from "@/pages/admin/SchedulesToBook/SchedulesToBookRow";
import { useSchedulesToBookHook } from "./useSchedulesToBook";
import { BookingConfirmationModal } from "@/components/BookingConfirmationModal/BookingConfirmationModal";
import { instance } from "@/api/axios";

interface Passenger {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  passportnumber: string;
  passportcountry: string;
  cabintypeid: number;
  flightNumbers: string;
  date: string;
}

const getCabinTypeId = (cabinType: string): number => {
  switch (cabinType.toLowerCase()) {
    case "economy":
      return 1;
    case "business":
      return 2;
    case "first":
      return 3;
    default:
      throw new Error(`Invalid cabin type: ${cabinType}`);
  }
};

export function SchedulesToBook() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      departureAirportCode: "",
      arrivalAirportCode: "",
      cabinType: "economy",
      ticketType: "one-way",
      flightDate: "",
      returnFlightDate: "",
      flexibleDates: false,
      flexibleReturnDates: false,
      flightNumber: "",
    },
  });

  const [filters, setFilters] = useState({
    departureAirportCode: "",
    arrivalAirportCode: "",
    cabinType: "economy",
    ticketType: "one-way",
    flightDate: "",
    returnFlightDate: "",
    flexibleDates: false,
    flexibleReturnDates: false,
  });

  const [sortBy, setSortBy] = useState<"date" | "economyprice" | "confirmed">(
    "date"
  );

  const { schedules, isLoading, error, refetch } = useSchedulesToBookHook(
    filters.departureAirportCode,
    filters.arrivalAirportCode,
    filters.flightDate,
    filters.returnFlightDate,
    filters.cabinType as "economy" | "business" | "first",
    filters.flexibleDates,
    filters.flexibleReturnDates,
    sortBy
  );

  const [selectedOutboundSchedule, setSelectedOutboundSchedule] = useState<
    number | null
  >(null);
  const [selectedReturnSchedule, setSelectedReturnSchedule] = useState<
    number | null
  >(null);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(
    null
  );

  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleApplyFilters = async (data: any) => {
    setFilters(data);
    refetch();
  };

  const handleOutboundScheduleSelect = (scheduleId: number) => {
    setSelectedOutboundSchedule(scheduleId);
  };

  const handleReturnScheduleSelect = (scheduleId: number) => {
    setSelectedReturnSchedule(scheduleId);
  };

  const checkAvailability = async () => {
    if (!selectedOutboundSchedule) {
      setAvailabilityMessage("Please select an outbound flight.");
      return;
    }

    if (filters.ticketType === "two-way" && !selectedReturnSchedule) {
      setAvailabilityMessage("Please select a return flight.");
      return;
    }

    try {
      const outboundResponse = await instance.get(
        `/schedules/${selectedOutboundSchedule}/check-availability`,
        {
          params: { passengerCount },
        }
      );

      let returnResponse = null;
      if (selectedReturnSchedule) {
        returnResponse = await instance.get(
          `/schedules/${selectedReturnSchedule}/check-availability`,
          {
            params: { passengerCount },
          }
        );
      }

      const outboundResult = outboundResponse.data;
      const returnResult = returnResponse ? returnResponse.data : null;

      if (
        outboundResult.available &&
        (!returnResult || returnResult.available)
      ) {
        setAvailabilityMessage(
          `${passengerCount} seats are available for the selected flight(s)!`
        );
        setShowBookingModal(true);
      } else {
        let message = `Not enough seats available.`;

        setAvailabilityMessage(message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAvailabilityMessage(
          `Error checking availability: ${error.response?.data?.message || error.message}`
        );
      } else {
        setAvailabilityMessage(
          "An unexpected error occurred. Please try again."
        );
      }
      console.error("Error checking availability:", error);
    }
  };

  const handleConfirmBooking = async (passengers: Passenger[]) => {
    try {
      const cabinTypeId = getCabinTypeId(filters.cabinType);
      
      const formattedPassengers = passengers.map(passenger => ({
        ...passenger,
        cabintypeid: cabinTypeId,
        flightNumbers: selectedReturnSchedule 
          ? `${schedules?.schedules.find(s => s.id === selectedOutboundSchedule)?.flightNumber}-${schedules?.returnSchedules.find(s => s.id === selectedReturnSchedule)?.flightNumber}`
          : schedules?.schedules.find(s => s.id === selectedOutboundSchedule)?.flightNumber,
        date: schedules?.schedules.find(s => s.id === selectedOutboundSchedule)?.date
      }));

      const response = await instance.post("/bookings/confirm-payment", {
        passengers: formattedPassengers,
        paymentMethod: "credit_card" // You might want to add a payment method selection in your UI
      });

      if (response.status === 200) {
        setAvailabilityMessage(`Booking confirmed successfully! Reference: ${response.data.bookingReference}`);
        setShowBookingModal(false);
      } else {
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  return (
    <>
      <div className={styles.header}>
        <h1>AMONIC Airlines Automation System for admin</h1>
        <LogoutButton />
      </div>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(handleApplyFilters)}>
          <div className={styles.filterRow}>
            <label>
              From:
              <input type="text" {...register("departureAirportCode")} />
            </label>

            <label>
              To:
              <input type="text" {...register("arrivalAirportCode")} />
            </label>

            <label>
              Cabin Type:
              <select {...register("cabinType")}>
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </label>

            <label>
              Ticket Type:
              <select {...register("ticketType")}>
                <option value="one-way">One-way</option>
                <option value="two-way">Two-way</option>
              </select>
            </label>

            <label>
              Outbound:
              <input type="date" {...register("flightDate")} />
            </label>

            <label>
              Return:
              <input type="date" {...register("returnFlightDate")} />
            </label>

            <label>
              Flexible Dates:
              <input type="checkbox" {...register("flexibleDates")} />
            </label>
            <label>
              Flexible Return Dates:
              <input type="checkbox" {...register("flexibleReturnDates")} />
            </label>

            <Button text="Apply" type="submit" />
          </div>
        </form>
      </div>

      <div className={styles.container}>
        <h2>Outbound Flights</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {(error as Error).message}</p>
        ) : schedules && schedules.schedules.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Time</th>
                <th>Flight Number</th>
                <th>Cabin Price</th>
                <th>Number of Stops</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {schedules.schedules.map((schedule) => (
                <SchedulesToBookRow
                  key={schedule.id}
                  data={schedule}
                  isSelected={selectedOutboundSchedule === schedule.id}
                  onSelect={() => handleOutboundScheduleSelect(schedule.id)}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p>No schedules found.</p>
        )}
      </div>

      {filters.returnFlightDate && (
        <div className={styles.container}>
          <h2>Return Flights</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {(error as Error).message}</p>
          ) : schedules && schedules.returnSchedules.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Flight Number</th>
                  <th>Cabin Price</th>
                  <th>Number of Stops</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {schedules.returnSchedules.map((schedule) => (
                  <SchedulesToBookRow
                    key={schedule.id}
                    data={schedule}
                    isSelected={selectedReturnSchedule === schedule.id}
                    onSelect={() => handleReturnScheduleSelect(schedule.id)}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <p>No return schedules found.</p>
          )}
        </div>
      )}

      <div className={styles.bookingConfirmation}>
        <span>Confirm booking for</span>
        <input
          type="text"
          value={passengerCount}
          onChange={(e) => setPassengerCount(Number(e.target.value))}
          min="1"
        />
        <span>Passengers</span>
        <Button text="Book flight" onClick={checkAvailability} />
      </div>

      {availabilityMessage && (
        <p className={styles.availabilityMessage}>{availabilityMessage}</p>
      )}

      {showBookingModal && schedules && (
        <BookingConfirmationModal
          outboundFlight={{
            from: schedules.schedules.find(s => s.id === selectedOutboundSchedule)?.routes.airports_routes_departureairportidToairports.iatacode || '',
            to: schedules.schedules.find(s => s.id === selectedOutboundSchedule)?.routes.airports_routes_arrivalairportidToairports.iatacode || '',
            cabinType: filters.cabinType,
            date: schedules.schedules.find(s => s.id === selectedOutboundSchedule)?.date || '',
            flightNumber: schedules.schedules.find(s => s.id === selectedOutboundSchedule)?.flightNumber || '',
          }}
          returnFlight={selectedReturnSchedule && schedules.returnSchedules.length > 0 ? {
            from: schedules.returnSchedules.find(s => s.id === selectedReturnSchedule)?.routes.airports_routes_departureairportidToairports.iatacode || '',
            to: schedules.returnSchedules.find(s => s.id === selectedReturnSchedule)?.routes.airports_routes_arrivalairportidToairports.iatacode || '',
            cabinType: filters.cabinType,
            date: schedules.returnSchedules.find(s => s.id === selectedReturnSchedule)?.date || '',
            flightNumber: schedules.returnSchedules.find(s => s.id === selectedReturnSchedule)?.flightNumber || '',
          } : undefined}
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </>
  );
}