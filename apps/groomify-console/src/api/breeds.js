const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { apiFetch } from "./api";

export async function getBreeds() {
  return await apiFetch("/api/breeds");
}

export async function createBreed(data) {
  return await apiFetch("/api/breeds",{
     method: "POST",
     body: JSON.stringify(data)
  });
}

export async function updateBreed(id, data) {
    return await apiFetch(`/api/breeds/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export async function deleteBreed(id) {
  return await apiFetch(`/api/breeds/${id}`, {
    method: "DELETE"
  })
}