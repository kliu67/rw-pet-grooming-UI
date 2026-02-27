export function isValidPrice(value) {
  return /^\d{0,8}(\.\d{0,2})?$/.test(value);
}

export const isValidPhone = (phone) =>{
    return /^[0-9+\-()\s]{6,20}$/.test(phone);
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}