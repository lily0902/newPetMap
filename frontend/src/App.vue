<template>
  <div style="">
    <div ref="mapContainer" style="width: 100%; height:100vh;" id="map"></div>
  </div>
  <button class="setting-btn z-50 fixed top-4 left-4" aria-label="設定" title="設定" @click="openFilterPanel">
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
    <button class="setting-btn" aria-label="設定" title="設定" @click="openFilterPanel">
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
      :types="ALL_TYPES"
      :selectedTypes="activeTypes"
      :openFilterOnly="openFilterOnly"
      @close="isPanelVisible = false"
      @toggleType="togglePlaceType"
    />
  </div>
  
  <!-- 右上角新增按鈕 -->
  <div class="fixed top-4 right-4 z-50 flex justify-end">
    <button
      title="Add New"
      class="group cursor-pointer outline-none hover:rotate-90 duration-300"
      @click="openForm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50px"
        height="50px"
        viewBox="0 0 24 24"
        class="stroke-indigo-400 fill-none group-hover:fill-indigo-800 group-active:stroke-indigo-200 group-active:fill-indigo-600 group-active:duration-0 duration-300"
      >
        <path
          d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
          stroke-width="1.5"
        ></path>
        <path d="M8 12H16" stroke-width="1.5"></path>
        <path d="M12 16V8" stroke-width="1.5"></path>
      </svg>
    </button>
  </div>

  <!-- 彈窗表單 -->
  <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
    <div class="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-lg shadow-md p-4 sm:p-6 relative job-form animate-slide-down">
      <button @click="closeForm" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">Job Application Form</h2>
      <form class="flex flex-col" @submit="submitForm" autocomplete="off">
        <input v-model="form.name" type="text" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 text-sm sm:text-base focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Full Name">
        <span v-if="errors.name" class="text-red-500 text-xs mb-2">{{ errors.name }}</span>
        <input v-model="form.email" type="email" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 text-sm sm:text-base focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Email">
        <span v-if="errors.email" class="text-red-500 text-xs mb-2">{{ errors.email }}</span>
        <input v-model="form.phone" type="text" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 text-sm sm:text-base focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Phone Number">
        <span v-if="errors.phone" class="text-red-500 text-xs mb-2">{{ errors.phone }}</span>
        <input v-model="form.linkedin" type="text" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 text-sm sm:text-base focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="LinkedIn Profile URL">
        <span v-if="errors.linkedin" class="text-red-500 text-xs mb-2">{{ errors.linkedin }}</span>
        <textarea v-model="form.cover" name="cover_letter" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 text-sm sm:text-base focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Cover Letter"></textarea>
        <span v-if="errors.cover" class="text-red-500 text-xs mb-2">{{ errors.cover }}</span>
        <input @change="handleFile" type="file" class="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-1 text-sm sm:text-base focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="Resume">
        <span v-if="errors.resume" class="text-red-500 text-xs mb-2">{{ errors.resume }}</span>
        <button type="submit" class="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 text-base sm:text-lg hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150">Apply</button>
      </form>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useMapStore } from '@/stores/mapStore';
import { useGeolocation } from '@/composables/useGeolocation';
import { useLocationStore } from '@/stores/locationStore';
import { usePlacesLoader } from '@/composables/usePlacesLoader';
import InfoPanel from '@/components/InfoPanel.vue';

const searchText = ref('');
const isFocused = ref(false);
const mapContainer = ref(null);
const selectedPlace = ref(null);
const isPanelVisible = ref(false);
const ALL_TYPES = ['醫院', '餐廳', '住宿'];
const activeTypes = ref([...ALL_TYPES]); // 一開始就顯示全部
const mapStore = useMapStore();
const locationStore = useLocationStore();
const openFilterOnly = ref(false);
const showForm = ref(false);
const form = ref({
  name: '',
  email: '',
  phone: '',
  linkedin: '',
  cover: '',
  resume: null
});
const errors = ref({});

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

function togglePlaceType(type) {
  if (
    activeTypes.value.length === 1 &&
    activeTypes.value.includes(type)
  ) {
    // 只有一個類型，且就是這個 → 回到全選
    activeTypes.value = [...ALL_TYPES];
  } else {
    // 否則就只保留這個類型
    activeTypes.value = [type];
  }
}



function openFilterPanel() {
  openFilterOnly.value = true;
  isPanelVisible.value = true; // 顯示面板
  //activeTypes.value = [...ALL_TYPES]; // 點設定 → 全部重選
}

function onMarkerClick(place) {
  selectedPlace.value = place;
  if (!isPanelVisible.value) {
    isPanelVisible.value = true; // 初次打開才觸發動畫
  }
}

// ✅ 篩選器 watch：變更時重新查詢地點資料
// watch(
//   [activeTypes, () => mapStore.map],
//   async ([types, map]) => {
//     if (!map) return;

//     console.log('[watch] activeTypes/map 觸發', types, map);

//     // 清空所有標記與標記陣列
//     const clearMarkers = (markersRef) => {
//       markersRef.value.forEach(marker => marker.setMap(null));
//       markersRef.value.length = 0;
//     };

//     clearMarkers(hospitalMarkers);
//     clearMarkers(restaurantMarkers);
//     clearMarkers(hotelMarkers);

//     const { loadPlacesByQuery } = usePlacesLoader(map, selectedPlace);

//     const tasks = [];

//     if (types.includes('醫院')) {
//       tasks.push(loadPlacesByQuery(
//         'veterinary_care',
//         hospitalMarkers.value,
//         './assets/icons/hospital.png',
//         onMarkerClick
//       ));
//     }

//     if (types.includes('餐廳')) {
//       tasks.push(loadPlacesByQuery(
//         '寵物 餐廳',
//         restaurantMarkers.value,
//         './assets/icons/restaurant.png',
//         onMarkerClick
//       ));
//     }

//     if (types.includes('住宿')) {
//       tasks.push(loadPlacesByQuery(
//         '寵物 住宿',
//         hotelMarkers.value,
//         './assets/icons/hotel.png',
//         onMarkerClick
//       ));
//     }

//     await Promise.all(tasks);
//   },
//   { immediate: true }
// );



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

    const { loadPlacesByQuery } = usePlacesLoader(() => mapStore.getMap(), selectedPlace);

    await Promise.all([
      loadPlacesByQuery('寵物 餐廳', restaurantMarkers.value, './assets/icons/restaurant.png', onMarkerClick),
      loadPlacesByQuery('寵物 住宿', hotelMarkers.value, './assets/icons/hotel.png', onMarkerClick),
      loadPlacesByQuery('veterinary_care', hospitalMarkers.value, './assets/icons/hospital.png', onMarkerClick)
    ]);

    //主動執行一次篩選邏輯
    //applyFilters();

  } catch (error) {
    console.error(error);
    alert('地圖載入失敗，請確認網路連線或 API 金鑰');
  }
});

// ✅ 只在地圖初始化時查詢並建立 marker
watch(
  () => mapStore.getMap(),
  async (map) => {
    if (!map) return;
    // 清空所有標記與標記陣列
    const clearMarkers = (markersRef) => {
      markersRef.value.forEach(marker => marker.setMap(null));
      markersRef.value.length = 0;
    };
    clearMarkers(hospitalMarkers);
    clearMarkers(restaurantMarkers);
    clearMarkers(hotelMarkers);

    const { loadPlacesByQuery } = usePlacesLoader(() => mapStore.getMap(), selectedPlace);
    const tasks = [];
    tasks.push(loadPlacesByQuery(
      'veterinary_care',
      hospitalMarkers.value,
      './assets/icons/hospital.png',
      onMarkerClick
    ));
    tasks.push(loadPlacesByQuery(
      '寵物 餐廳',
      restaurantMarkers.value,
      './assets/icons/restaurant.png',
      onMarkerClick
    ));
    tasks.push(loadPlacesByQuery(
      '寵物 住宿',
      hotelMarkers.value,
      './assets/icons/hotel.png',
      onMarkerClick
    ));
    await Promise.all(tasks);
    updateMarkersVisibility(); // 查詢完後根據篩選顯示
  },
  { immediate: true }
);

// ✅ 切換篩選時只切換顯示/隱藏，不重建 marker
watch(
  activeTypes,
  () => {
    updateMarkersVisibility();
  }
);

// 新增：根據 activeTypes 控制 marker 顯示/隱藏，並加上 debug log
function updateMarkersVisibility() {
  const map = mapStore.getMap();
  if (!map) return;

  window.hotelMarkers = hotelMarkers;
  window.restaurantMarkers = restaurantMarkers;
  window.hospitalMarkers = hospitalMarkers;
  window.mapStore = mapStore;

  if (activeTypes.value.includes('醫院')) {
    hospitalMarkers.value.forEach(marker => {
      marker.setMap(map);
      if (typeof marker.setVisible === 'function') marker.setVisible(true);
    });
  } else {
    hospitalMarkers.value.forEach(marker => {
      marker.setMap(null);
      if (typeof marker.setVisible === 'function') marker.setVisible(false);
    });
  }
  if (activeTypes.value.includes('餐廳')) {
    restaurantMarkers.value.forEach(marker => {
      marker.setMap(map);
      if (typeof marker.setVisible === 'function') marker.setVisible(true);
    });
  } else {
    restaurantMarkers.value.forEach(marker => {
      marker.setMap(null);
      if (typeof marker.setVisible === 'function') marker.setVisible(false);
    });
  }
  if (activeTypes.value.includes('住宿')) {
    hotelMarkers.value.forEach(marker => {
      marker.setMap(map);
      if (typeof marker.setVisible === 'function') marker.setVisible(true);
    });
  } else {
    hotelMarkers.value.forEach(marker => {
      marker.setMap(null);
      if (typeof marker.setVisible === 'function') marker.setVisible(false);
    });
  }
}

function openForm() {
  showForm.value = true;
  setTimeout(() => {
    const firstInput = document.querySelector('.job-form input, .job-form textarea');
    if (firstInput) firstInput.focus();
  }, 100);
}
function closeForm() {
  showForm.value = false;
  errors.value = {};
}

function validateForm() {
  const e = {};
  if (!form.value.name) e.name = 'Full Name is required';
  if (!form.value.email) e.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) e.email = 'Invalid email';
  if (!form.value.phone) e.phone = 'Phone Number is required';
  if (!form.value.linkedin) e.linkedin = 'LinkedIn is required';
  if (!form.value.cover) e.cover = 'Cover Letter is required';
  if (!form.value.resume) e.resume = 'Resume is required';
  errors.value = e;
  return Object.keys(e).length === 0;
}

function handleFile(e) {
  form.value.resume = e.target.files[0];
}

function submitForm(ev) {
  ev.preventDefault();
  if (validateForm()) {
    // 可在此送出資料
    closeForm();
  }
}

function handleEsc(e) {
  if (e.key === 'Escape' && showForm.value) closeForm();
}
onMounted(() => {
  window.addEventListener('keydown', handleEsc);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc);
});
</script>

<style scoped>
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
@keyframes slide-down {
  0% {
    opacity: 0;
    transform: translateY(-200px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-slide-down {
  animation: slide-down 0.3s cubic-bezier(0.4,0,0.2,1);
}
</style>
