import { API_URL } from "@/constants";
import { createApiFetch } from "@shared-api";

export const apiFetch = createApiFetch({ baseUrl: API_URL });
