export function resolveBucaramangaCoords(address?: string, seed: number = 1) {
  const baseLat = 7.1193;
  const baseLng = -73.1227;
  const offsetLat = ((seed * 17) % 50) / 1000;
  const offsetLng = ((seed * 23) % 50) / 1000;
  
  return {
    address: address || 'Carrera 27 # 36-10, Bucaramanga',
    lat: baseLat + offsetLat,
    lng: baseLng + offsetLng,
  };
}
