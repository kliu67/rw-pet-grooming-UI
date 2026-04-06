import { useMutation, useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import { getServiceConfigurations, getConfigByFKs, getDistinctConfigPriceByServiceIds } from "@/api/serviceConfigurations";
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

export function useDistinctConfigsByServiceIds({
  serviceIds = [],
  enabled = true
}: {
  serviceIds?: number[];
  enabled?: boolean;
}) {
  return useQueries({
    queries: serviceIds.map((serviceId) => ({
      queryKey: [SERVICE_CONFIGURATIONS_QUERY_KEY, serviceId],
      queryFn: () => getDistinctConfigPriceByServiceIds(serviceId),
      enabled: enabled && !!serviceId
    }))
  });
}
