export const parseCoordinates = (coord: string) => {
  return coord.split("m").map(val => parseFloat(val.trim()));
};