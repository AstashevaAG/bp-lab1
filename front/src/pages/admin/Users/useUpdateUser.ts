import { IUpdateUserForm } from "@/components/UpdateUserForm/UpdateUserForm";
import { IUpdateUserSessionForm } from "@/components/UpdateUserSessionForm/UpdateUserSessionForm";
import userService from "@/services/user.service";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export const useUpdateUser = (): UseMutationResult<
  any,
  Error,
  { id: number; data: IUpdateUserForm }
> => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await userService.updateUser(id, data);
    },
  });
};
export const useUpdateSession = (): UseMutationResult<
  any,
  Error,
  { id: number; data: IUpdateUserSessionForm }
> => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await userService.updateUserSession(id, data);
    },
  });
};
