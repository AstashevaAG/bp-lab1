import { PUBLIC_PAGES } from "@/config/pages/public.config";
import authService from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useTransition } from "react";
import styles from '@/pages/user/User.module.scss'
import { LogOutIcon } from "lucide-react";
const LogoutButton = () => {
  const [isPending, startTransition] = useTransition();

  const { mutate: mutateLogout, isPending: isLogoutPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => authService.logout(),
    onSuccess() {
      startTransition(() => {
        window.location.href = PUBLIC_PAGES.LOGIN;
      });
    },
  });
  const isLogoutLoading = isLogoutPending || isPending;

  return (
    <button
      onClick={() => mutateLogout()}
      disabled={isLogoutLoading}
      className={styles.exitButton}
    >
      {isLogoutLoading ? "EXITING..." : <div style={{display: 'flex', gap: 5, alignItems: "center"}}>EXIT <LogOutIcon size={20}/></div>}
    </button>
  );
};

export default LogoutButton;
