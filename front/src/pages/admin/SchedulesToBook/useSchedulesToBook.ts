


import { useQuery } from '@tanstack/react-query';
import schedulesService from '@/services/schedules.service';

export function useSchedulesToBookHook(
  departureAirportCode?: string,
  arrivalAirportCode?: string,
  flightDate?: string,
  returnFlightDate?: string,
  ticketClass: 'economy' | 'business' | 'first' = 'economy',
  flexibleDates: boolean = false,
  flexibleReturnDates: boolean = false,
  sortBy: 'date' | 'economyprice' | 'confirmed' | 'undefined' = 'date'
) {
  const {
    data: schedules,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['schedulesToBook', departureAirportCode, arrivalAirportCode, flightDate, returnFlightDate, ticketClass, flexibleDates, flexibleReturnDates, sortBy],
    queryFn: () => schedulesService.searchSchedulesToBook(
      departureAirportCode,
      arrivalAirportCode,
      flightDate,
      returnFlightDate,
      ticketClass,
      flexibleDates,
      flexibleReturnDates,
      sortBy
    ),
    retry: 1
  });

  return {
    schedules,
    isLoading,
    error,
    refetch,
  };
}