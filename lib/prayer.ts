import { PrayerTimes, CalculationMethod, Madhab, Coordinates } from 'adhan';

export function getPrayerTimes(lat: number, lng: number, date = new Date()) {
  const coords = new Coordinates(lat, lng);
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi;
  return new PrayerTimes(coords, date, params);
}

export async function getLocation(): Promise<{lat:number,lng:number}> {
  return new Promise((res, rej) => {
    if(!navigator.geolocation) return rej("No location support");
    navigator.geolocation.getCurrentPosition(
      p => res({ lat: p.coords.latitude, lng: p.coords.longitude }),
      e => rej(e),
      { enableHighAccuracy: true }
    );
  });
}
