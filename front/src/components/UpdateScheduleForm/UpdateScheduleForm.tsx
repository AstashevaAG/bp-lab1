import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./UpdateScheduleForm.module.scss";
import Button from "@/ui/Button/Button";
import { useUpdateSchedule } from "@/pages/admin/Schedules/useUpdateSchedules";
import schedulesService from "@/services/schedules.service";

export interface IUpdateScheduleForm {
  date: string;
  time: string;
  economyprice: number;
}

const UpdateScheduleModal: React.FC<{
  onClose: () => void;
  onScheduleUpdated: () => void;
  scheduleId: number;
}> = ({ scheduleId, onClose, onScheduleUpdated }) => {
  const { register, handleSubmit, reset } = useForm<IUpdateScheduleForm>();
  const { mutate: updateSchedule, isSuccess } = useUpdateSchedule();
  const [scheduleInfo, setScheduleInfo] = useState({ from: '', to: '', aircraft: '' });

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = (await schedulesService.fetchAllSchedules(undefined, undefined, undefined, undefined, undefined, scheduleId)).data[0];
        setScheduleInfo({
          from: response.routes.airports_routes_departureairportidToairports.iatacode,
          to: response.routes.airports_routes_arrivalairportidToairports.iatacode,
          aircraft: response.aircrafts.name
        });
        reset({
          date: response.date.toString().split('T')[0],
          time: response.date.toString().split('T')[1].substring(0, 5),
          economyprice: response.economyprice
        });
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchScheduleData();
  }, [scheduleId, reset]);

  const onSubmit = (data: IUpdateScheduleForm) => {
    const payload = {
      ...data,
      date: `${data.date}T${data.time}:00Z`
    };

    updateSchedule(
      { id: scheduleId, data: payload },
      {
        onSuccess: () => {
          reset();
          onScheduleUpdated();
          onClose();
        },
      }
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Schedule edit</h2>
        <div className={styles.infoRow}>
          <div>From: {scheduleInfo.from}</div>
          <div>To: {scheduleInfo.to}</div>
          <div>Aircraft: {scheduleInfo.aircraft}</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputRow}>
            <div>
              <label>Date:</label>
              <input type="date" {...register("date", { required: true })} />
            </div>
            <div>
              <label>Time:</label>
              <input type="time" {...register("time", { required: true })} />
            </div>
            <div>
              <label>Economy price: $</label>
              <input type="number" {...register("economyprice", { required: true, min: 0 })} />
            </div>
          </div>

          <div className={styles.actions}>
            <Button text="UPDATE" type="submit" />
            <Button text="CANCEL" onClick={onClose} />
          </div>
          {isSuccess && <p>Schedule updated successfully!</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdateScheduleModal;
