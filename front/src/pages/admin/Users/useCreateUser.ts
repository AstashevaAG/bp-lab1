import { ICreateUserForm } from "@/components/CreateUserForm/CreateUserForm";
import authService from "@/services/auth/auth.service";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export const useCreateUser = (): UseMutationResult<any, Error, ICreateUserForm> => {
  return useMutation({
    mutationFn: authService.createUser,
  });
};
