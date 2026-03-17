import { useQuery } from "@tanstack/react-query";
import { getAvailability, getAvailabilityById } from "@/api/availability";
import { AVAILABILITY_QUERY_KEY } from "@/constants";

export function useAvaiability() {
  return useQuery({
    queryKey: [AVAILABILITY_QUERY_KEY],
    queryFn: getAvailability,
  });
}

export function useAvailabiltyById(stylistId: number | string | undefined) {
  return useQuery({
    queryKey: [AVAILABILITY_QUERY_KEY, stylistId],
    queryFn: () => getAvailabilityById(stylistId),
    enabled: stylistId !== undefined && stylistId !== null && stylistId !== "",
  });
}
