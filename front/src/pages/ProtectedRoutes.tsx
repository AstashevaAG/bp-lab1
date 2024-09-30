import { PUBLIC_PAGES } from "@/config/pages/public.config";
import { useProfile } from "@/hooks/useProfile";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const { user, isLoading } = useProfile();
  console.log(user);
  if (isLoading) return <div>Loading...</div>;

  const is404Redirect = user.roleid !== 1;
  if (!user?.isLoggedIn)
    return <Navigate to={is404Redirect ? "*" : PUBLIC_PAGES.LOGIN} replace />;

  if (is404Redirect) {
    return <Navigate to={"*"} replace />;
  }

  return <Outlet />;
};
