//
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
//service constants
export const MAX_SERVICE_NAME_LENGTH = 60;
export const MAX_SERVICE_DESC_LENGTH = 200;
export const MIN_SERVICE_BASE_PRICE_VALUE = 0;
export const MAX_SERVICE_BASE_PRICE_VALUE = 99999999.99;
export const SERVICES_QUERY_KEY = "services";

//breed constants
export const BREEDS_QUERY_KEY = "breeds";
export const MAX_BREED_NAME_LENGTH = 60;

//client constants
export const CLIENTS_QUERY_KEY = "clients";
export const MAX_CLIENT_FIRST_NAME_LENGTH = 60;
export const MAX_CLIENT_LAST_NAME_LENGTH = 60;
export const MAX_CLIENT_EMAIL_LENGTH = 60;
export const MAX_CLIENT_PHONE_LENGTH = 20;
export const MAX_CLIENT_DESC_LENGTH = 200;

//pets
export const MAX_PET_NAME_LENGTH = 60;
export const PETS_QUERY_KEY = "pets";

//weight classes
export const WEIGHT_CLASSES_QUERY_KEY = "weightClasses";

//service configurations
export const SERVICE_CONFIGURATIONS_QUERY_KEY = "serviceConfigurations";

//appointments
export const APPOINTMENTS_QUERY_KEY = "appointments";

//stylists
export const STYLISTS_QUERY_KEY = "stylists";

//availability
export const AVAILABILITY_QUERY_KEY = "avaialability";

//time-offs
export const TIMEOFFS_QUERY_KEY = "timeOffs";