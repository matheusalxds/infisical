export const maskField = (value: string) => {
  if (value.length <= 3) return value;
  return value.slice(0, 3) + "*".repeat(value.length - 3);
};
