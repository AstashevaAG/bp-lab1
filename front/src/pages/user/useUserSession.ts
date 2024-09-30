import userService from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export function useUserSession() {
  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    error: userProfileError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userService.getUserProfile,
  });

  const {
    data: userSessions,
    isLoading: isUserSessionsLoading,
    error: userSessionsError,
  } = useQuery({
    queryKey: ["userSessions"],
    queryFn: userService.getUserSessions,
  });
  const {
    data: userSessionsCrashes,
    isLoading: isUserSessionsCrashesLoading,
    error: userSessionsCrashesError,
  } = useQuery({
    queryKey: ["userSessionsCrashes"],
    queryFn: userService.getUserSessionsCrashes,
  });
  const {
    data: userSessionsTime,
    isLoading: isUserSessionsTimeLoading,
    error: userSessionsTimeError,
  } = useQuery({
    queryKey: ["userSessionsTime"],
    queryFn: userService.getUserSessionsTime,
  });

  const isLoading =
    isUserProfileLoading ||
    isUserSessionsLoading ||
    isUserSessionsCrashesLoading ||
    isUserSessionsTimeLoading;

  return {
    isLoading,
    userProfile,
    userSessions,
    userSessionsCrashes,
    userSessionsTime,
    userProfileError,
    userSessionsError,
    userSessionsCrashesError,
    userSessionsTimeError,
  };
}
