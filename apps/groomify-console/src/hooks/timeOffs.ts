import { useMutation, useQuery,  useQueryClient } from "@tanstack/react-query";
import { getTimeOffs, getTimeOffByStylistId } from "@/api/timeOffs";
import { TIMEOFFS_QUERY_KEY } from "@/constants";

export function useTimeOffs() {
  return useQuery({
    queryKey: [TIMEOFFS_QUERY_KEY],
    queryFn: getTimeOffs
  });
}

export function useTimeOffById(stylistId: number | string | undefined) {
  return useQuery({
    queryKey: [TIMEOFFS_QUERY_KEY, stylistId],
    queryFn: () => getTimeOffByStylistId(stylistId),
    enabled: stylistId !== undefined && stylistId !== null && stylistId !== "",
  });
}