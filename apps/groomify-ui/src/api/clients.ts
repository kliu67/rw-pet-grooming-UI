import { createClientsApi } from "@shared-api";
import { apiFetch } from "./api";

const clientsApi = createClientsApi({ apiFetch });

export const { getClients, createClient, updateClient, deleteClient } = clientsApi;
