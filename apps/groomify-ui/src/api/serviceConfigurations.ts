import { apiFetch } from "./api";

export function getServiceConfigurations() {
  return apiFetch("/api/serviceConfigurations");
}

export async function getConfigByFKs(serviceId, breedId, weightClassId ){
  return await apiFetch(`/api/serviceConfigurations?service_id=${serviceId}&breed_id=${breedId}&weight_class_id=${weightClassId}`)
}
