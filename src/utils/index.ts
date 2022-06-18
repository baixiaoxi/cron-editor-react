export const isNumber = (obj: any) => {
  return typeof obj === 'number' && !isNaN(obj);
};
