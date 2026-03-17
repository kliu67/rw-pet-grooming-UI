// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { apiFetch } from "./api";
export async function getServiceConfigurations() {
  return await apiFetch("/api/serviceConfigurations");
}
