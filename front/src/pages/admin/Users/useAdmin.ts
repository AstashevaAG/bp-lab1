import officesService from "@/services/offices.service";
import userService from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/types/types";

export function useUserAdmin(officeId?: number) {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
    refetch,
  } = useQuery({
    queryKey: ["usersAdmin", officeId],
    queryFn: () => userService.fetchList(officeId),
  });

  const {
    data: offices,
    isLoading: isOfficesLoading,
    error: officesError,
  } = useQuery({
    queryKey: ["offices"],
    queryFn: () => officesService.fetchAllOffices(),
  });

  const { mutate: activateUser } = useMutation<IUser, Error, number>({
    mutationFn: (id: number) => userService.activateUser(id),
    onSuccess: () => {
      const queryKey =
        officeId !== undefined ? ["usersAdmin", officeId] : ["usersAdmin"];
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const isLoading = isUsersLoading || isOfficesLoading;

  return {
    isLoading,
    refetch,
    users,
    offices,
    activateUser,
    usersError,
    officesError,
  };
}
