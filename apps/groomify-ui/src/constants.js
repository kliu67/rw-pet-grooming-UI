//
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const INTERVAL_MINUTES = 30;
export const CONFIRM_DELETE = "DELETE";
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
export const MAX_FIRST_NAME_LENGTH = 60;
export const MAX_LAST_NAME_LENGTH = 60;
export const MAX_EMAIL_LENGTH = 60;
export const MAX_PHONE_LENGTH = 20;
export const MIN_PHONE_LENGTH = 8;
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
export const MAX_APPOINTMENTS_DESC_LENGTH = 200;

//stylists
export const STYLISTS_QUERY_KEY = "stylists";

//availability
export const AVAILABILITY_QUERY_KEY = "avaialability";

//time-offs
export const TIMEOFFS_QUERY_KEY = "timeOffs";

//users
export const USERS_QUERY_KEY = "users";
export const MAX_PASSWORD_LENGTH = 72;
export const MIN_PASSWORD_LENGTH = 8;

export const emailRegex = new RegExp(
  `^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$`,
  "i",
);
export const firstNameRegex = new RegExp(
  `^(?=.{1,${MAX_FIRST_NAME_LENGTH}}$)(?!\\s*$).+`,
);
export const lastNameRegex = new RegExp(
  `^(?=.{1,${MAX_LAST_NAME_LENGTH}}$)(?!\\s*$).+`,
);
export const phoneRegex = /^(?!-)(?!.*--)[0-9]+(?:-[0-9]+)*$/;
export const passwordRegex = new RegExp(
  `^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$`,
);


export const DEFAULT_STYLIST=1;