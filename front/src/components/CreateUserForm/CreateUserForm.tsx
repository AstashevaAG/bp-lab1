import React from "react";
import { useForm } from "react-hook-form";
import styles from "./CreateUserForm.module.scss";
import Button from "@/ui/Button/Button";
import { useCreateUser } from "@/pages/admin/Users/useCreateUser";
import { IOffice } from "@/types/types";

export interface ICreateUserForm {
  email: string;
  firstname: string;
  lastname: string;
  title: string;
  officeId: number;
  birthdate: Date;
  password: string;
}

const CreateUserModal: React.FC<{
  offices: IOffice[] | undefined;
  onClose: () => void;
  onUserCreated: () => void; // New prop to trigger data refresh
}> = ({ offices, onClose, onUserCreated }) => {
  const { register, handleSubmit, reset } = useForm<ICreateUserForm>();
  const { mutate: createUser, isSuccess } = useCreateUser();

  const onSubmit = (data: ICreateUserForm) => {
    const officeId = Number(data.officeId);
    const birthdate = new Date(data.birthdate);

    const payload = {
      ...data,
      officeId,
      birthdate,
    };

    createUser(payload, {
      onSuccess: () => {
        reset();
        onUserCreated(); // Call the prop to refresh data
        onClose();
      },
    });
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
          <select {...register("officeId", { required: true })}>
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
          <label>Birthdate:</label>
          <input type="date" {...register("birthdate", { required: true })} />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            {...register("password", { required: true })}
          />
        </div>
        <div className={styles.actions}>
          <Button text="Create User" />
          <Button text="Cancel" onClick={onClose} />
        </div>
        {isSuccess && <p>User created successfully!</p>}
      </form>
    </div>
  );
};

export default CreateUserModal;
