export function isValidPrice(value) {
  return /^\d{0,8}(\.\d{0,2})?$/.test(value);
}