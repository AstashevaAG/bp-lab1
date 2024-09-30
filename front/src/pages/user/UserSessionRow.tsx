import styles from "./User.module.scss";

export interface IUserSessionRow {
  date: string;
  loginTime: string;
  logoutTime: string;
  timeSpent: string;
  unsuccessfulLogoutReason: string;
}

const UserSessionRow: React.FC<{ data: IUserSessionRow }> = ({ data }) => {
  return (
    <tr
      className={data.unsuccessfulLogoutReason !== "-" ? styles.errorRow : ""}
    >
      <td>{data.date}</td>
      <td>{data.loginTime}</td>
      <td>{data.logoutTime}</td>
      <td>{data.timeSpent}</td>
      <td>{data.unsuccessfulLogoutReason}</td>
    </tr>
  );
};

export default UserSessionRow;
