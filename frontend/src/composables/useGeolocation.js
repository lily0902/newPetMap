// src/composables/useGeolocation.js
import { useLocationStore } from '@/stores/locationStore';

export function useGeolocation(mapRef = null) {
  const locationStore = useLocationStore();

  function start(){
    if (!navigator.geolocation) {
      alert('此瀏覽器不支援定位功能');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const userLocation = { lat, lng };

        locationStore.setUserLocation(lat, lng); // 存進 Pinia

        // 如果地圖存在就自動置中與加標記
        if (mapRef?.value) {
          mapRef.value.setCenter(userLocation);
          new google.maps.marker.AdvancedMarkerElement({
            map: mapRef.value,
            position: userLocation,
            title: '你的位置'
          });
        }
      },
      (error) => {
        console.error('定位失敗', error);
      }
    );
  };
  return { start };
}
