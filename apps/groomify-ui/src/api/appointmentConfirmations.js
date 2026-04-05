import { apiFetch } from "./api";

export function getConfirm(id) {
  return apiFetch(`/api/appointmentConfirmations/${id}`);
}