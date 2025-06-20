<template>
  <div style="">
    <div ref="mapContainer" style="width: 100%; height:100vh;" ></div>
  </div>
  <button class="setting-btn" aria-label="設定" title="設定">
    <span class="bar bar1"></span>
    <span class="bar bar2"></span>
    <span class="bar bar1"></span>
  </button>
  <div class="relative  w-fit mx-auto">
    <input
      v-model="searchText"
      :class="[
        'bg-white shadow-lg border border-gray-300 px-10 py-2 rounded-xl transition-all outline-none pr-10',
        isFocused || searchText ? 'w-80' : 'w-89'
      ]"
      @focus="isFocused = true"
      @blur="isFocused = false"
      placeholder="Search..."
      type="search"
    />
    
    <!-- 搜尋圖示 -->
    <svg
      class="size-5 absolute top-2.5 left-3 text-gray-400 pointer-events-none"
      stroke="currentColor"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        stroke-linejoin="round"
        stroke-linecap="round"
      ></path>
    </svg>

    <!-- 設定按鈕 -->
    <button class="setting-btn" aria-label="設定" title="設定">
      <span class="bar bar1"></span>
      <span class="bar bar2"></span>
      <span class="bar bar1"></span>
    </button>

    <!-- 搜尋欄 -->
    <div class="relative w-fit mx-auto">
      <input
        v-model="searchText"
        :class="[
          'bg-white shadow-lg border border-gray-300 px-10 py-2 rounded-xl transition-all outline-none pr-10',
          isFocused || searchText ? 'w-80' : 'w-89'
        ]"
        @focus="isFocused = true"
        @blur="isFocused = false"
        placeholder="Search..."
        type="search"
      />
      <!-- 搜尋圖示 -->
      <svg
        class="size-5 absolute top-2.5 left-3 text-gray-400 pointer-events-none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          stroke-linejoin="round"
          stroke-linecap="round"
        ></path>
      </svg>
      <!-- 清除按鈕 -->
      <button
        v-if="searchText"
        @click="clearSearch"
        class="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
        type="button"
      >
        ✕
      </button>
    </div>

    <!-- InfoPanel -->
    <InfoPanel
      :visible="isPanelVisible"
      :place="selectedPlace"
      :types="['醫院', '餐廳', '住宿']"
      :selectedTypes="[]"
      @close="isPanelVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import { useGeolocation } from '@/composables/useGeolocation';
import { useLocationStore } from '@/stores/locationStore';
import { usePlacesLoader } from '@/composables/usePlacesLoader';

const searchText = ref('');
const isFocused = ref(false);
const mapContainer = ref(null);
const selectedPlace = ref(null);
const isPanelVisible = ref(false);

const mapStore = useMapStore();
const locationStore = useLocationStore();

const restaurantMarkers = ref([]);
const hotelMarkers = ref([]);
const hospitalMarkers = ref([]); // 若你有
//const { loadPlacesByQuery } = usePlacesLoader(map, selectedPlace);



//provide('googleMap', map) // 提供給子組件使用

// 清除搜尋
function clearSearch() {
  searchText.value = '';
  isFocused.value = false;
}

// 點擊標記開啟資訊欄
function onMarkerClick(place) {
  selectedPlace.value = place;
  isPanelVisible.value = true;
}

// 載入 Google Maps JS API
function loadGoogleMapsApi(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve(window.google.maps);

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places&v=beta&loading=async`;
    script.defer = true;

    script.onload = () => {
      const check = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(check);
          resolve(window.google.maps);
        }
      }, 50);

      setTimeout(() => {
        clearInterval(check);
        reject(new Error('Google Maps API timeout'));
      }, 5000);
    };

    script.onerror = () => reject(new Error('Google Maps API load error'));

    document.head.appendChild(script);
    
  });
}

onMounted(async () => {
  try {
    await loadGoogleMapsApi(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

    const { start } = useGeolocation(mapStore.map);
    start();

    

    await new Promise((resolve) => {
      const stop = watch(
        () => locationStore.userLocation,
        (loc) => {
          if (loc.lat && loc.lng) {
            stop();
            resolve();
          }
        },
        { immediate: true }
      );
    });

    const mapInstance = new google.maps.Map(mapContainer.value, {
      zoom: 18,
      disableDefaultUI: true,
      center: locationStore.userLocation,
      mapId: '53b3bfe44dee182f2d3a79eb',
    });

    mapStore.setMap(mapInstance);

    const { loadPlacesByQuery } = usePlacesLoader(mapInstance, selectedPlace);

    loadPlacesByQuery('寵物 餐廳', restaurantMarkers.value, './assets/icons/restaurant.png', onMarkerClick);
    loadPlacesByQuery('寵物 住宿', hotelMarkers.value, './assets/icons/hotel.png', onMarkerClick);
    loadPlacesByQuery('veterinary_care', hospitalMarkers.value, './assets/icons/hospital.png', onMarkerClick);
  } catch (error) {
    console.error(error);
    alert('地圖載入失敗，請確認網路連線或 API 金鑰');
  }
});
</script>

<style scoped>
@import "tailwindcss";
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}
.setting-btn {
  width: 45px;
  height: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: rgb(129, 110, 216);
  border-radius: 10px;
  cursor: pointer;
  border: none;
  box-shadow: 0px 0px 0px 2px rgb(212, 209, 255);
  position: fixed;
  top: 5px;
  left: 5px;
}
.bar {
  width: 50%;
  height: 2px;
  background-color: rgb(229, 229, 229);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 2px;
}
.bar::before {
  content: "";
  width: 2px;
  height: 2px;
  background-color: rgb(126, 117, 255);
  position: absolute;
  border-radius: 50%;
  border: 2px solid white;
  transition: all 0.3s;
  box-shadow: 0px 0px 5px white;
}
.bar1::before {
  transform: translateX(-4px);
}
.bar2::before {
  transform: translateX(4px);
}
.setting-btn:hover .bar1::before {
  transform: translateX(4px);
}
.setting-btn:hover .bar2::before {
  transform: translateX(-4px);
}
.relative {
  position: fixed;
  top: 10px;
  left: 40%;
}
</style>
