import { defineStore } from 'pinia';

let map = null; // 只存原生 Google Map 物件，移到外層
const userLocation = { lat: null, lng: null };

export const useMapStore = defineStore('map', () => {
  function setMap(mapInstance) {
    map = mapInstance;
  }

  function getMap() {
    return map;
  }

  function setUserLocation(lat, lng) {
    userLocation.lat = lat;
    userLocation.lng = lng;
  }

  return { setMap, getMap, userLocation, setUserLocation };
});
