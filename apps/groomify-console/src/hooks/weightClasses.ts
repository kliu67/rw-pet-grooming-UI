import { useQuery } from "@tanstack/react-query";
import { getWeightClasses } from "@/api/weightClasses";
import { WEIGHT_CLASSES_QUERY_KEY } from "@/constants";

export function useWeightClasses() {
  return useQuery({
    queryKey: [WEIGHT_CLASSES_QUERY_KEY],
    queryFn: getWeightClasses
  });
}