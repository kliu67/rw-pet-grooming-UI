import { createServicesApi } from "@shared-api";
import { apiFetch } from "./api";

const servicesApi = createServicesApi({ apiFetch });

export const { getServices, createService, updateService, deleteService } = servicesApi;
