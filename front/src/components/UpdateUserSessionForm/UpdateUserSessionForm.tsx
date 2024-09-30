import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./UpdateUserSessionForm.module.scss";
import Button from "@/ui/Button/Button";
import userService from "@/services/user.service";
import { useUpdateSession } from "@/pages/admin/Users/useUpdateUser";
export interface IUpdateUserSessionForm {
  errorMessage: string;
  crashType: 'SYSTEM' | 'SOFTWARE'
}

const UpdateUserSessionModal: React.FC<{
  onClose: () => void;
  onUserSessionUpdated: () => void;
  sessionId: number;
}> = ({ sessionId, onClose, onUserSessionUpdated }) => {
  const { register, handleSubmit, reset } = useForm<IUpdateUserSessionForm>();
  const { mutate: updateUser, isSuccess } = useUpdateSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userService.getAllSessions(sessionId);
        reset({
          ...response[0],
        });
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchUserData();
  }, [sessionId, reset]);

  const onSubmit = (data: IUpdateUserSessionForm) => {
    const payload = {
      ...data,
    };

    updateUser(
      { id: sessionId, data: payload },
      {
        onSuccess: () => {
          reset();
          onUserSessionUpdated();
          onClose();
        },
      }
    );
  };

  return (
    <div className={styles.modal}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div>
          <label>Reason:</label>
          <textarea {...register("errorMessage", { required: true })} />
        </div>
        <div>
          <label>Crash type:</label>
          <select {...register("crashType", { required: true })}>
            <option value="">Select a crash type</option>
            <option value="SYSTEM">System crash</option>
            <option value="SOFTWARE">Software crash</option>
          </select>
        </div>

        <div className={styles.actions}>
          <Button text="Update User" />
          <Button text="Cancel" onClick={onClose} />
        </div>
        {isSuccess && <p>User updated successfully!</p>}
      </form>
    </div>
  );
};

export default UpdateUserSessionModal;
