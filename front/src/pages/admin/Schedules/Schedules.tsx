import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSchedulesAdmin } from "./useSchedules";
import styles from "./Schedules.module.scss";
import Button from "@/ui/Button/Button";
import LogoutButton from "@/ui/LogoutButton/LogoutButton";
import SchedulesRow from "./SchedulesRow";
import { toast } from "react-hot-toast";
import UpdateScheduleModal from "@/components/UpdateScheduleForm/UpdateScheduleForm";
import ImportSchedulesModal, {
  ImportResults,
} from "@/components/ImportSchedulesModal/ImportSchedulesModal";
export function Schedules() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      departureAirportCode: undefined,
      arrivalAirportCode: undefined,
      flightNumber: undefined,
      flightDate: undefined,
    },
  });

  const [filters, setFilters] = useState({
    departureAirportCode: undefined,
    arrivalAirportCode: undefined,
    flightNumber: undefined,
    flightDate: undefined,
  });

  const [sortBy, setSortBy] = useState<"date" | "economyprice" | "confirmed">(
    "date"
  );
  const [scheduleIdToEdit, setScheduleIdToEdit] = useState<number | null>(null);
  const { schedules, isLoading, refetch, schedulesError, toggleSchedule } =
    useSchedulesAdmin(
      scheduleIdToEdit ? scheduleIdToEdit : undefined,
      filters.departureAirportCode,
      filters.arrivalAirportCode,
      filters.flightNumber,
      filters.flightDate,
      sortBy
    );

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleApplyFilters = async (data: any) => {
    const newFilters: any = {};

    if (data.departureAirportCode)
      newFilters.departureAirportCode = data.departureAirportCode;
    if (data.arrivalAirportCode)
      newFilters.arrivalAirportCode = data.arrivalAirportCode;
    if (data.flightNumber) newFilters.flightNumber = data.flightNumber;
    if (data.flightDate) newFilters.flightDate = data.flightDate;

    await setFilters(newFilters);
    refetch();
  };

  const handleCloseModal = () => {
    setScheduleIdToEdit(null);
  };

  const handleScheduleUpdated = () => {
    refetch();
    toast.success("Schedule updated successfully!");
  };

  const handleImportSchedules = (results: ImportResults) => {
    toast.success(
      `Successfully applied ${results.results.response.successful} changes`
    );
    refetch();
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
              Outbound:
              <input type="date" {...register("flightDate")} />
            </label>

            <label>
              Flight Number:
              <input type="text" {...register("flightNumber")} />
            </label>

            <Button text="Apply" type="submit" />
          </div>
        </form>
      </div>

      <div className={styles.container}>
        <div className={styles.actions}>
          <div className={styles.sort}>
            <label>
              Sort by:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="date">Date</option>
                <option value="economyprice">Economy Price</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </label>
          </div>
          <Button
            text="Import schedules"
            onClick={() => setIsImportModalOpen(true)}
          />
        </div>

        {schedules?.data?.schedules?.length ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>From</th>
                <th>To</th>
                <th>Flight Number</th>
                <th>Aircraft</th>
                <th>Economy price</th>
                <th>Business price</th>
                <th>First class price</th>
                <th className="hidden">Edit</th>
                <th className="hidden">Toggle</th>
              </tr>
            </thead>
            <tbody>
              {schedules ? (
                schedules.data.schedules.map((schedule) => (
                  <SchedulesRow
                    key={schedule.id}
                    data={schedule}
                    onEdit={() => setScheduleIdToEdit(schedule.id)}
                    onDisable={() => toggleSchedule(schedule.id)}
                  />
                ))
              ) : (
                <p>Schedules not found!</p>
              )}
            </tbody>
          </table>
        ) : (
          <p>Not found!</p>
        )}
      </div>

      {scheduleIdToEdit && (
        <UpdateScheduleModal
          scheduleId={scheduleIdToEdit}
          onClose={handleCloseModal}
          onScheduleUpdated={handleScheduleUpdated}
        />
      )}

      {isImportModalOpen && (
        <ImportSchedulesModal
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportSchedules}
        />
      )}
    </>
  );
}
