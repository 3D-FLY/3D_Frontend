let cache = null;
let pending = null;

export function loadCityOptions() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = import("country-state-city").then(({ City, Country }) => {
      const countryMap = Object.fromEntries(
        Country.getAllCountries().map((c) => [c.isoCode, c.name]),
      );
      cache = City.getAllCities()
        .filter((c) => c.latitude && c.longitude)
        .map((c) => {
          const countryName = countryMap[c.countryCode] ?? c.countryCode;
          const lat = parseFloat(c.latitude);
          const lng = parseFloat(c.longitude);
          return { lat, lng, countryName, cityName: c.name };
        })
        .filter((c) => !Number.isNaN(c.lat) && !Number.isNaN(c.lng))
        .map((c) => ({
          value: `${c.cityName}||${c.countryName}||${c.lat}||${c.lng}`,
          label: `${c.cityName}, ${c.countryName}`,
          searchKey: `${c.cityName} ${c.countryName}`.toLowerCase(),
          lat: c.lat,
          lng: c.lng,
          cityName: c.cityName,
          countryName: c.countryName,
        }));
      return cache;
    });
  }
  return pending;
}
