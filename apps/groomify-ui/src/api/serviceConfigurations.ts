import { apiFetch } from "./api";

export function getServiceConfigurations() {
  return apiFetch("/api/serviceConfigurations");
}
