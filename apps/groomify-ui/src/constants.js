//
import { Scissors, Droplets, Heart, Sparkles, Brush } from "lucide-react";
import fullServiceImage from "./static/img/full_service.webp";
import bathImage from "./static/img/bath.webp";
import basicServiceImage from "./static/img/basic_service.webp";
import demattingImage from "./static/img/dematting.webp";
import nailClippingImage from "./static/img/nail_clipping.webp";
import earCleaningImage from "./static/img/ear_cleaning.webp";
import catBathImage from "./static/img/cat_bath.webp";
import catBathLongImage from "./static/img/cat_bath_long.webp";
import catHairTrimmingImage from "./static/img/cat_hair_trimming.webp";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const INTERVAL_MINUTES = 20;
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
export const MAX_BREED_LENGTH = 60;
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

export const DEFAULT_STYLIST = 1;

export const staticServiceData = [
  {
    code: "FULL-GROOMING",
    price: "From $65",
    description:
      "Bath, blow dry, brush out, haircut, nail trim, and ear cleaning. The full treatment.",
    icon: Scissors,
    image:
      "https://images.unsplash.com/photo-1703368786305-4e1dcfcfd0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBnZXR0aW5nJTIwaGFpcmN1dHxlbnwxfHx8fDE3NzA0MDY0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    code: "BATH",
    price: "From $40",
    description:
      "Deep cleansing bath, conditioning, blow dry, and thorough brush out to reduce shedding.",
    icon: Droplets,
    image:
      "https://images.unsplash.com/photo-1680374642577-441d91f91ea5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBiYXRoJTIwYnViYmxlc3xlbnwxfHx8fDE3NzA0MDY0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    code: "BASIC_GROOMING",
    price: "From $35",
    description:
      "Gentle introduction to grooming for puppies under 5 months. Bath, light trim, and lots of cuddles.",
    icon: Heart,
    image:
      "https://images.unsplash.com/photo-1730403257848-a38a393f1b60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkb2clMjBncm9vbWVyfGVufDF8fHx8MTc3MDM5NzU5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    code: "EAR_CLEANING",
    price: "From $10",
    description:
      "Add-ons like teeth brushing, paw balm, blueberry facials, and nail grinding.",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1769025939291-0603d7b76bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBwYXclMjBjYXJlfGVufDF8fHx8MTc3MDQwNjU2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    code: "NAIL_TRIMMING",
    price: "From $10",
    description:
      "Add-ons like teeth brushing, paw balm, blueberry facials, and nail grinding.",
    icon: Brush,
    image:
      "https://images.unsplash.com/photo-1769025939291-0603d7b76bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBwYXclMjBjYXJlfGVufDF8fHx8MTc3MDQwNjU2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    code: "DEMATTING",
    description: "",
    icon: Brush,
    image:
      "https://images.unsplash.com/photo-1769025939291-0603d7b76bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBwYXclMjBjYXJlfGVufDF8fHx8MTc3MDQwNjU2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export const serviceImageMap = {
  FULL_GROOMING: fullServiceImage,
  BATH_BRUSH: bathImage,
  BASIC_GROOMING: basicServiceImage,
  DEMATTING: demattingImage,
  NAIL_TRIMMING: nailClippingImage,
  EAR_CLEANING: earCleaningImage,
  CAT_BATH: catBathImage,
  CAT_BATH_LONG: catBathLongImage,
  CAT_HAIR_TRIMMING: catHairTrimmingImage,
};

export const iconMap = {
  FULL_GROOMING: Scissors,
  BATH_BRUSH: Droplets,
  BASIC_GROOMING: Heart,
  DEMATTING: Brush,
  NAIL_TRIMMING: Scissors,
  EAR_CLEANING: Sparkles,
  CAT_BATH: Droplets,
  CAT_BATH_LONG: Droplets,
  CAT_HAIR_TRIMMING: Scissors,
};

export const serviceTextMap = {
  FULL_GROOMING: {
    name: "services.dog.fullGrooming.name",
    desc: "services.dog.fullGrooming.desc",
  },
  BASIC_GROOMING: {
    name: "services.dog.basicGrooming.name",
    desc: "services.dog.basicGrooming.desc",
  },
  BATH_BRUSH: {
    name: "services.dog.bath.name",
    desc: "services.dog.bath.desc"
  },
  DEMATTING: {
    name: "services.dog.dematting.name",
    desc: "services.dog.dematting.desc"
    },
  EAR_CLEANING: {
    name: "services.dog.earCleaning.name",
    desc: "services.dog.earCleaning.desc"
  },
  NAIL_TRIMMING: {
    name: "services.dog.nailTrimming.name",
    desc: "services.dog.nailTrimming.desc"
  },
  CAT_HAIR_TRIMMING: {
    name: "services.cat.hairTrimming.name",
    desc: "services.cat.hairTrimming.desc"
  },
  CAT_BATH: {
    name: "services.cat.bath.name",
    desc: "services.cat.bath.desc"
  },
  CAT_BATH_LONG: {
    name: "services.cat.bathLong.name",
    desc: "services.cat.bathLong.name"
  }
};

export const defaultImage =
  "https://images.unsplash.com/photo-1703368786305-4e1dcfcfd0db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBnZXR0aW5nJTIwaGFpcmN1dHxlbnwxfHx8fDE3NzA0MDY0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export const BOOKING_STEPS = {
  SPECIES: 1,
  SERVICE: 2,
  PET: 3,
  DATE_TIME: 4,
  PERSONAL: 5,
  REVIEW: 6,
  CONFIRM: 7,
};

export const SPECIES = {
  DOG: "DOG",
  CAT: "CAT",
};

export const DEFAULT_STATUS = "booked";
export const LOCALE = "en-US";
export const CONTACT_INFO = {
  email: "rwpetgrooming@gmail.com",
  phone: "780-893-1007",
  street: "115 Mumbai Drive",
  city: "Markham",
  province: "ON",
  postal: "L3S 0G3",
};
