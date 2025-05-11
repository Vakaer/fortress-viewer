const calculateOrbit = (positionStr: string, normalStr: string) => {

  const normal = normalStr.trim().split('m').filter(Boolean).map(parseFloat);

  // Invert the normal to get camera direction
  const x = -normal[0];
  const y = -normal[1];
  const z = -normal[2];

  // Calculate spherical coordinates
  const radius = Math.sqrt(x * x + y * y + z * z);
  const theta = Math.atan2(x, z) * (180 / Math.PI); // Azimuth
  const phi = Math.acos(y / radius) * (120 / Math.PI); // Elevation

  // Round values for cleaner output
  const dataOrbit = `${theta.toFixed(2)}deg ${phi.toFixed(2)}deg ${radius.toFixed(2)}m`;

  return dataOrbit;
};

export default calculateOrbit;