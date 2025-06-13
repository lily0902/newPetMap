<template>
  <div style="">
    <div ref="mapContainer" style="width: 100%; height:100vh;" ></div>
  </div>
  <button class="setting-btn">
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

    <!-- 清除按鈕 -->
    <button
      v-if="searchText"
      @click="searchText = ''"
      class="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600 "
      type="button" 
    >
      ✕
    </button>
  </div>
  <location />

</template>

<script setup>
import { ref, onMounted, provide , watch , inject} from 'vue';
import location from './components/location.vue';

const searchText = ref('');

const map = ref(null);

provide('googleMap', map) // 提供給子組件使用

function clearSearch() {
  searchText.value = ''
  isFocused.value = false
}

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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=beta`;
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

    const { AdvancedMarkerElement } = google.maps.marker;

    // 自訂地圖樣式，隱藏所有不需要的地標
    const mapStyle = [
      {
          "featureType": "poi.business", // 隱藏商業地標
          "stylers": [{ "visibility": "off" }] 
      },
      {
          "featureType": "poi", // 隱藏其他地標
          "stylers": [{ "visibility": "off" }]
      }
    ];

    const map = new googleMaps.Map(mapContainer.value, {
      //center: { lat: 25.033, lng: 121.5654 }, // 台北101附近
      zoom: 18,
      disableDefaultUI: true,
      //styles: mapStyle,
      mapId: '53b3bfe44dee182f2d3a79eb',// 使用自訂樣式
    });

    // 你也可以這裡新增標記、路線等
    // new googleMaps.Marker({
    //   position: { lat: 25.033, lng: 121.5654 },
    //   map,
    //   title: '台北101',
    // });

    // 定位使用者
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // 重新置中地圖
                map.setCenter(userLocation);

                // 顯示使用者位置的標記
                const marker = new AdvancedMarkerElement({
                    position: userLocation,
                    map,
                    title: '你的位置',
                    // icon: {
                    //     url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    // }
                });
            },
            (error) => {
                console.error("定位失敗", error);
            }
        );
    } else {
        alert("此瀏覽器不支援定位功能");
    }

    
  } catch (error) {
    console.error(error);
  }
});
</script>
<style scoped>
  @import "tailwindcss";
  /* 隱藏 Chrome/Edge 的內建清除按鈕 */
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
    top:5px;
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
  .relative{
    position:fixed;
    top: 10px;
    left: 40%;
  }
</style>