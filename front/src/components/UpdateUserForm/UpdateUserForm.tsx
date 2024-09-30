import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./UpdateUserForm.module.scss";
import Button from "@/ui/Button/Button";
import { IOffice } from "@/types/types";
import { useUpdateUser } from "@/pages/admin/Users/useUpdateUser";
import userService from "@/services/user.service"; // Импортируйте ваш сервис для получения данных пользователя

export interface IUpdateUserForm {
  email: string;
  firstname: string;
  lastname: string;
  title: string;
  officeid: number;
  birthdate: Date;
  password: string;
  roleid: number;
}

const UpdateUserModal: React.FC<{
  offices: IOffice[] | undefined;
  onClose: () => void;
  onUserUpdated: () => void;
  userId: number;
}> = ({ userId, offices, onClose, onUserUpdated }) => {
  const { register, handleSubmit, reset } = useForm<IUpdateUserForm>();
  const { mutate: updateUser, isSuccess } = useUpdateUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userService.getById(userId);
        reset({
          ...response.data,
          title: response.data.title,
          officeid: response.data.officeid,
          roleid: response.data.roleid,
        });
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchUserData();
  }, [userId, reset]);

  const onSubmit = (data: IUpdateUserForm) => {
    const officeId = Number(data.officeid);
    const roleId = Number(data.roleid);

    const payload = {
      ...data,
      officeid: officeId,
      roleid: roleId,
    };

    updateUser(
      { id: userId, data: payload },
      {
        onSuccess: () => {
          reset();
          onUserUpdated();
          onClose();
        },
      }
    );
  };

  return (
    <div className={styles.modal}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div>
          <label>Email:</label>
          <input type="email" {...register("email", { required: true })} />
        </div>
        <div>
          <label>Title:</label>
          <input type="text" {...register("title", { required: true })} />
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" {...register("firstname", { required: true })} />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" {...register("lastname", { required: true })} />
        </div>
        <div>
          <label>Office:</label>
          <select {...register("officeid", { required: true })}>
            <option value="">Select an office</option>
            {offices &&
              offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.title}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label>Role:</label>
          <select {...register("roleid", { required: true })}>
            <option value={1}>Administrator</option>
            <option value={2}>User</option>
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

export default UpdateUserModal;
