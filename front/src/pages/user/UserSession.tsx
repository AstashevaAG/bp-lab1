import { PUBLIC_PAGES } from "@/config/pages/public.config";
import styles from "./User.module.scss";
import { useTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/auth/auth.service";
import UserSessionRow from "./UserSessionRow";
import { IUserSession } from "./user.types";
import { useUserSession } from "./useUserSession";
import LogoutButton from "@/ui/LogoutButton/LogoutButton";

interface LoginData {
  date: string;
  loginTime: string;
  logoutTime: string;
  timeSpent: string;
  unsuccessfulLogoutReason: string;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const calculateTimeSpent = (loginTime: string, logoutTime: string) => {
  if (!logoutTime) return "-";

  const diffInMs =
    new Date(logoutTime).getTime() - new Date(loginTime).getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

const transformData = (serverData: IUserSession[] | undefined) => {
  if (serverData) {
    return serverData.map((entry) => {
      const loginDate = new Date(entry.loginTime);

      return {
        date: loginDate.toLocaleDateString(),
        loginTime: formatTime(entry.loginTime),
        logoutTime: entry.logoutTime ? formatTime(entry.logoutTime) : "-",
        timeSpent: calculateTimeSpent(entry.loginTime, entry.logoutTime),
        unsuccessfulLogoutReason: entry.errorOccurred
          ? entry.errorMessage
          : "-",
      };
    });
  }
};

export default function AmonicTable() {
  const {
    userProfile,
    userSessions,
    userSessionsCrashes,
    userSessionsTime,
    isLoading,
  } = useUserSession();
  if (isLoading) return <div>Loading...</div>;

  const loginData: LoginData[] | undefined = transformData(userSessions);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>AMONIC Airlines Automation System for user</h1>
        <LogoutButton />
      </div>
      <div className={styles.userInfo}>
        <p>
          HI {userProfile && userProfile.firstname}, Welcome to AMONIC Airlines.
        </p>
        <div>
          <p>
            Time spent on system:{" "}
            {userSessionsTime &&
              userSessionsTime.hours.toString().padStart(2, "0") +
                ":" +
                userSessionsTime.minutes.toString().padStart(2, "0") +
                ":" +
                userSessionsTime.seconds.toString().padStart(2, "0")}
          </p>
          <p>
            Number of crashes: {userSessionsCrashes ? userSessionsCrashes : 0}
          </p>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Login time</th>
            <th>Logout time</th>
            <th>Time spent on system</th>
            <th>Unsuccessful logout reason</th>
          </tr>
        </thead>
        <tbody>
          {loginData ? (
            loginData.map((data, index) => (
              <UserSessionRow key={index} data={data} />
            ))
          ) : (
            <p>No data</p>
          )}
        </tbody>
      </table>
    </div>
  );
}
