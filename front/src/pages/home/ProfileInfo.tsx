import { PUBLIC_PAGES } from "@/config/pages/public.config";
import { useProfile } from "@/hooks/useProfile";
import authService from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import cn from "clsx";

import { useTransition } from "react";

export function ProfileInfo() {
  const { user, isLoading } = useProfile();

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

  if (isLoading) return <div className="mt-10">Загружаю профиль...</div>;

  return (
    <div className="mt-10">
      {user.avatarPath && (
        <img src={user.avatarPath} alt="Avatar" width={70} height={70} />
      )}
      <h2 className="text-2xl font-bold">
        Привет, {user.firstname || "Аноним"}
      </h2>
      <br />
      <p className="text-lg">Ваш email: {user.email}</p>
      <br />
      <p>Права: {user.roleid}</p>
      <br />
      <button
        onClick={() => mutateLogout()}
        disabled={isLogoutLoading}
        className={cn("mt-2 bg-blue-500 text-white px-4 py-2 rounded-md", {
          "bg-gray-500": isLogoutLoading,
        })}
      >
        {isLogoutLoading ? "Выходим..." : "Выйти"}
      </button>
    </div>
  );
}
