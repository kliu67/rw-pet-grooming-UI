export function isValidPrice(value) {
  return /^\d{0,8}(\.\d{0,2})?$/.test(value);
}

export const isValidPhone = (phone) => {
  return /^[0-9+\-()\s]{6,20}$/.test(phone);
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getNameLexicalOrder = (person) => {
  const { first_name, last_name } = person;
  return [last_name, first_name].filter(Boolean).join(", ") || "-";
};

export const getNameStandard = (person) => {
  const { first_name, last_name } = person;
  return [first_name, last_name].filter(Boolean).join(" ") || "-";
};

export const isObjectNotEmpty = (obj) => {
  return obj && typeof obj === "object" && Object.keys(obj).length > 0;
};

export const areAllObjectKeysEmpty = (obj) => {
  if (!obj || typeof obj !== "object") {
    return true;
  }

  return Object.keys(obj).every((key) => {
    const value = obj[key];
    return value === "" || value === null || value === undefined;
  });
};
