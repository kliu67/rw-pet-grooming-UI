import { apiFetch } from "./api";

export function getAppointments() {
  return apiFetch("/api/appointments");
}

export function getAppointmentByStylistId(id) {
  return apiFetch(`/api/appointments/stylist/${id}`);
}

export function getUpcomingAppointmentsByStylistId(id) {
  return apiFetch(`/api/appointments/stylist/${id}/upcoming`);
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
