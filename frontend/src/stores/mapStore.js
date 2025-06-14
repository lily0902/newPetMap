import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMapStore = defineStore('map', () => {
  const map = ref(null);
  const userLocation = ref({ lat: null, lng: null });

  function setMap(mapInstance) {
    map.value = mapInstance;
  }

  function setUserLocation(lat, lng) {
    userLocation.value = { lat, lng };
  }

  return { map, setMap, userLocation, setUserLocation };
});
