import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServiceConfigurations } from "@/api/serviceConfigurations";
import { SERVICE_CONFIGURATIONS_QUERY_KEY } from "@/constants";

export function useServiceConfigurations() {
  return useQuery({
    queryKey: [SERVICE_CONFIGURATIONS_QUERY_KEY],
    queryFn: getServiceConfigurations
  });
}