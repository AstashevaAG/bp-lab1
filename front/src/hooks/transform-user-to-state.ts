import { TProtectUserData, UserRole } from "@/services/auth/auth.types";

export type TUserDataState = {
  id: number;
  isLoggedIn: boolean;
};

export const transformUserToState = (
  user: TProtectUserData,
): TUserDataState | null => {

  return {
    ...user,
    isLoggedIn: true,
  };
};
