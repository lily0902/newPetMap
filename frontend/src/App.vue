<template>
  <div style="">
    <div ref="mapContainer" style="width: 100%; height:100vh;" ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const mapContainer = ref(null);

function loadGoogleMapsApi(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      // 已經載入過了
      resolve(window.google.maps);
      return;
    }

    // 建立 script 標籤
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve(window.google.maps);
    };
    script.onerror = () => {
      reject(new Error('Google Maps API load error'));
    };

    document.head.appendChild(script);
  });
}

onMounted(async () => {
  try {
    const googleMaps = await loadGoogleMapsApi('AIzaSyBfC4H3RT-whyYWCRCwB3c4WsgYgT2Oqww');

    console.log(mapContainer.value);
    const map = new googleMaps.Map(mapContainer.value, {
      center: { lat: 25.033, lng: 121.5654 }, // 台北101附近
      zoom: 18,
      disableDefaultUI: true,
    });

    // 你也可以這裡新增標記、路線等
    new googleMaps.Marker({
      position: { lat: 25.033, lng: 121.5654 },
      map,
      title: '台北101',
    });
  } catch (error) {
    console.error(error);
  }
});
</script>
