// Haversine distance in kilometers between two lat/lng points
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Score: 100 for 0km, 1 for 1000km or more, linear in between
export function calculateScore(distanceKm: number): number {
  const maxScore = 100;
  const minScore = 1;
  const maxDistance = 1000; // km
  if (distanceKm >= maxDistance) return minScore;
  const score = Math.round(maxScore - ((distanceKm / maxDistance) * (maxScore - minScore)));
  return Math.max(minScore, score);
}
