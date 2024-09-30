import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { IUpdateScheduleForm } from "@/components/UpdateScheduleForm/UpdateScheduleForm";
import schedulesService from "@/services/schedules.service";

export const useUpdateSchedule = (): UseMutationResult<
  any,
  Error,
  { id: number; data: IUpdateScheduleForm }
> => {
  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await schedulesService.updateSchedule(id, data);
    },
  });
};
