import { Pencil } from "lucide-react";

export interface IUserErrorSessions {
  id: number;
  users: { firstname: string };
  loginTime: string;
  errorOccured: boolean;
  errorMessage: string;
}

const SessionRow: React.FC<{
  data: IUserErrorSessions;
  onEdit: () => void;
}> = ({ data, onEdit }) => {
  const date = new Date(data.loginTime);
  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.users.firstname}</td>
      <td>
        {date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}
      </td>
      <td>
        {date.getHours().toString().padStart(2, "0") +
          ":" +
          date.getMinutes().toString().padStart(2, "0")}
      </td>
      <td style={{ display: "block", maxWidth: "160px" }}>
        {data.errorMessage.length > 30
          ? data.errorMessage.slice(0, 15) + "..."
          : data.errorMessage}
      </td>
      <td>
        <Pencil color="black" onClick={onEdit} />
      </td>
    </tr>
  );
};

export default SessionRow;
