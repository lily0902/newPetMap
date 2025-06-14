// src/stores/locationStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLocationStore = defineStore('location', () => {
  const userLocation = ref({ lat: null, lng: null });

  function setUserLocation(lat, lng) {
    userLocation.value = { lat, lng };
  }

  return { userLocation, setUserLocation };
});
