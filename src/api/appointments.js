import { API_URL } from "@/constants";

export async function getAppointments() {
  const res = await fetch(`${API_URL}/api/appointments`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch appointments");
  }

  return res.json();
}

export async function createAppointment(data) {
  const res = await fetch(`${API_URL}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;   // important
  }

  return res.json();
}

export async function updateAppointment(id, data) {
  const res = await fetch(`${API_URL}/api/appointments/${id}/update`, {
    method: "PATCH", // or PATCH depending on backend
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to update appointment");
  }

  return res.json();
}

export async function deleteAppointment(id) {
  const res = await fetch(`${API_URL}/api/appointments/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete appointment");
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}