import { createApiFetch } from "@shared-api";
import { API_URL } from "@/constants";

export const apiFetch = createApiFetch({ baseUrl: API_URL });
