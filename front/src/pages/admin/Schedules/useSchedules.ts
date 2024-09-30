import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import schedulesService from "@/services/schedules.service";

export function useSchedulesAdmin(
  id?: number,
  departureAirportCode?: string,
  arrivalAirportCode?: string,
  flightNumber?: string,
  flightDate?: string,
  sortBy?: "date" | "economyprice" | "confirmed"
) {
  const queryClient = useQueryClient();
  const {
    data: schedules,
    isLoading: isSchedulesLoading,
    error: schedulesError,
    refetch,
  } = useQuery({
    queryKey: [
      "schedulesAdmin",
      departureAirportCode,
      arrivalAirportCode,
      flightNumber,
      flightDate,
      sortBy,
    ],
    queryFn: () =>
      schedulesService.fetchAllSchedules(
        departureAirportCode,
        arrivalAirportCode,
        flightNumber,
        flightDate,
        sortBy,
        id
      ),
    retry: 0,
  });

  const { mutate: toggleSchedule } = useMutation({
    mutationFn: (id: number) => schedulesService.toggleSchedulesStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedulesAdmin"] });
    },
  });

  return {
    isLoading: isSchedulesLoading,
    refetch,
    schedules,
    toggleSchedule,
    schedulesError,
  };
}
