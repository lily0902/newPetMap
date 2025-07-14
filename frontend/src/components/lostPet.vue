<template>
  <div>
    <div ref="mapContainer" style="width: 100%; height: 400px"></div>
    <LostPetInfo v-if="selectedReport" :report="selectedReport" @close="selectedReport = null" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import LostPetInfo from './LostPetInfo.vue';

const mapContainer = ref(null);
const reports = ref([]);
const selectedReport = ref(null);
const userLocation = ref({ lat: 25.033964, lng: 121.564468 }); // 預設台北101

onMounted(async () => {
  // 取得使用者座標
  await getUserLocation();

  const res = await axios.get('/api/missing-pets');
  reports.value = res.data.reports || [];
  console.log('走失資料', reports.value);
  await loadGoogleMapsApi(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  const map = new window.google.maps.Map(mapContainer.value, {
    center: userLocation.value,
    zoom: 12,
  });
  reports.value.forEach(report => {
    const marker = new window.google.maps.Marker({
      position: { lat: parseFloat(report.latitude), lng: parseFloat(report.longitude) },
      map,
      title: report.petName || '走失寵物',
      icon: '/assets/icons/searchpet.png'
    });
    marker.addListener('click', () => {
      selectedReport.value = report;
    });
  });
});

function getUserLocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLocation.value = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          resolve();
        },
        () => resolve(), // 失敗時維持預設
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      resolve();
    }
  });
}

function loadGoogleMapsApi(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve(window.google.maps);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
</script>
