import { apiFetch } from "./api";

export function getWeightClasses() {
  return apiFetch("/api/weightClasses");
}
