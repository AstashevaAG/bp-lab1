import React, { useState } from "react";
import styles from "./Sessions.module.scss";
import SessionRow, { IUserErrorSessions } from "./SessionRow";
import UpdateUserSessionModal from "@/components/UpdateUserSessionForm/UpdateUserSessionForm";
import LogoutButton from "@/ui/LogoutButton/LogoutButton";
const SessionTable: React.FC<{
  sessions: IUserErrorSessions[];
  onRefetch: () => void;
}> = ({ sessions, onRefetch }) => {
  const [errorSessionIdToEdit, setErrorSessionIdToEdit] = useState<
    number | null
  >(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Error check page for admin</h1>
        <LogoutButton />
      </div>
      {errorSessionIdToEdit !== null && (
        <UpdateUserSessionModal
          sessionId={errorSessionIdToEdit}
          onClose={() => setErrorSessionIdToEdit(null)}
          onUserSessionUpdated={onRefetch}
        />
      )}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Login Time</th>
            <th style={{ maxWidth: "160px", display: "block" }}>
              Unsuccessful logout reason
            </th>
            <th className="hidden">Edit</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <SessionRow
              key={session.id}
              data={session}
              onEdit={() => {
                setErrorSessionIdToEdit(session.id);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;
