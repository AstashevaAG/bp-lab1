import SessionTable from "./SessionTable";
import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user.service";
const Sessions = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["errorSessions"],
    queryFn: () => userService.getAllSessions(undefined, true),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {(error as Error).message}</p>;
  if (!data) return <p>Something went wrong: Sessions not found</p>;
  return (
    <div className="">

      <SessionTable sessions={data} onRefetch={refetch} />;
    </div>
  );
};

export default Sessions;
