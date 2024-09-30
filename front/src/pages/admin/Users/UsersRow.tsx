import { useProfile } from "@/hooks/useProfile";
import styles from "./Admin.module.scss";
import { Pencil, UserCheck, UserX } from "lucide-react";

export interface IUserRow {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  roles: {
    id: number;
    title: string;
  };
  active: boolean;
  email: string;
  offices: {
    id: number;
    title: string;
  };
}

const calculateAge = (birthdate: string): number => {
  const birthDateObj = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }

  return age;
};

const UserRow: React.FC<{
  data: IUserRow;
  onEdit: () => void;
  onActivate: () => void;
}> = ({ data, onEdit, onActivate }) => {
  const { user } = useProfile();

  return (
    <tr
      className={
        !data.active
          ? styles.errorRow
          : data.roles.title === "Administrator"
            ? styles.okRow
            : ""
      }
    >
      <td>{data.id}</td>
      <td>{data.firstname}</td>
      <td>{data.lastname}</td>
      <td>{calculateAge(data.birthdate)}</td>
      <td>{data.roles.title}</td>
      <td>{data.email}</td>
      <td>{data.offices.title}</td>
      <td>
        <Pencil color="black" onClick={onEdit} />
      </td>
      {data.id !== user.id && (
        <td>
          {data.active ? (
            <UserX color="black" onClick={onActivate} />
          ) : (
            <UserCheck color="black" onClick={onActivate} />
          )}
        </td>
      )}
    </tr>
  );
};

export default UserRow;
