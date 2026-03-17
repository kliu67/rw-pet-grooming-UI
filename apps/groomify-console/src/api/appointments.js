import { apiFetch } from "./api";

export async function getAppointments() {
   return await apiFetch("/api/appointments");
}

export async function createAppointment(data) {
  return await apiFetch("/api/appointments", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updateAppointment(id, data) {
   return await apiFetch(`/api/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export async function deleteAppointment(id) {
  return await apiFetch(`/api/appointments/${id}`, {
    method: "DELETE"
  })
}