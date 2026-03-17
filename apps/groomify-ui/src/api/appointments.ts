import { apiFetch } from "./api";

export function getAppointments() {
  return apiFetch("/api/appointments");
}

export function createAppointment(data: unknown) {
  return apiFetch("/api/appointments", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateAppointment(id: number | string, data: unknown) {
  return apiFetch(`/api/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteAppointment(id: number | string) {
  return apiFetch(`/api/appointments/${id}`, {
    method: "DELETE"
  });
}
