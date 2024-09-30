import UserRow from "./UsersRow";
import styles from "./Admin.module.scss";
import LogoutButton from "@/ui/LogoutButton/LogoutButton";
import { useUserAdmin } from "./useAdmin";
import { useState } from "react";
import Button from "@/ui/Button/Button";
import CreateUserModal from "@/components/CreateUserForm/CreateUserForm";
import UpdateUserModal from "@/components/UpdateUserForm/UpdateUserForm";

export function Users() {
  const [selectedOfficeId, setSelectedOfficeId] = useState<number | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToEdit, setUserIdToEdit] = useState<number | null>(null);

  const { users, offices, isLoading, refetch, activateUser } =
    useUserAdmin(selectedOfficeId);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>AMONIC Airlines Automation System for admin</h1>
        <LogoutButton />
      </div>

      <div className={styles.actions}>
        <label className={styles.officeFilter}>
          Office:
          <select
            value={selectedOfficeId ?? ""}
            onChange={(e) =>
              setSelectedOfficeId(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">All offices:</option>
            {offices &&
              offices.data.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.title}
                </option>
              ))}
          </select>
        </label>
        <Button text="Create User" onClick={() => setIsModalOpen(true)} />
      </div>

      {isModalOpen && (
        <CreateUserModal
          offices={offices && offices.data}
          onClose={() => setIsModalOpen(false)}
          onUserCreated={refetch}
        />
      )}

      {userIdToEdit !== null && (
        <UpdateUserModal
          userId={userIdToEdit}
          offices={offices && offices.data}
          onClose={() => setUserIdToEdit(null)}
          onUserUpdated={refetch}
        />
      )}

      {users?.data?.length ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>User Role</th>
              <th>Email Address</th>
              <th>Office</th>
              <th className="hidden">Edit</th>
              <th className="hidden">Ban</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((user) => (
              <UserRow
                key={user.id}
                data={user}
                onEdit={() => {
                  setUserIdToEdit(user.id);
                }}
                onActivate={() => {
                  activateUser(user.id);
                }}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>Not found!</p>
      )}
    </div>
  );
}
