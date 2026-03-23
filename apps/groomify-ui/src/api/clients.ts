import { createClientsApi } from "@shared-api";
import { apiFetch } from "./api";

const clientsApi = createClientsApi({ apiFetch });

export const { getClients, getClient, lookupClient, createClient, updateClient, deleteClient } = clientsApi;
