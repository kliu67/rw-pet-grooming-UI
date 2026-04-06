// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { apiFetch } from "./api";
export async function getServiceConfigurations() {
  return await apiFetch("/api/serviceConfigurations");
}

export async function getConfigByFKs(serviceId, breedId, weightClassId ){
  return await apiFetch(`/api/serviceConfigurations?service_id=${serviceId}&breed_id=${breedId}&weight_class_id=${weightClassId}`)
}