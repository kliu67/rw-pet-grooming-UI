import { apiFetch } from "./api";

export function getServiceConfigurations() {
  return apiFetch("/api/serviceConfigurations");
}

export async function getConfigByFKs(serviceId, weightClassId ){
  return await apiFetch(`/api/serviceConfigurations?service_id=${serviceId}&weight_class_id=${weightClassId}`)
}

export async function getDistinctConfigPriceByServiceIds(serviceId){
  return await apiFetch(`/api/serviceConfigurations/service/${serviceId}/grouped-by-weight-class`)
}