import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServiceConfigurations, getConfigByFKs } from "@/api/serviceConfigurations";
import { SERVICE_CONFIGURATIONS_QUERY_KEY } from "@/constants";

export function useServiceConfigurations() {
  return useQuery({
    queryKey: [SERVICE_CONFIGURATIONS_QUERY_KEY],
    queryFn: getServiceConfigurations
  });
}

export function useConfigByFKs(data) {
  const{ serviceId, breedId, weightClassId } = data;
  return useQuery({
    queryKey: [SERVICE_CONFIGURATIONS_QUERY_KEY, serviceId, breedId, weightClassId],
    queryFn: () => getConfigByFKs(serviceId, breedId, weightClassId),
    enabled: !!serviceId && !!breedId && !!weightClassId
  });
}