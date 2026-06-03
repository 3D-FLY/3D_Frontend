/** Persists world-atlas load across navigations / remounts. */
let ready = false;

export function isWorldGeoReady() {
  return ready;
}

export function setWorldGeoReady() {
  ready = true;
}
