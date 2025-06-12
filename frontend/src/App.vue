<template>
  <div style="">
    <div ref="mapContainer" style="width: 100%; height:100vh;" ></div>
  </div>
  <button class="setting-btn">
    <span class="bar bar1"></span>
    <span class="bar bar2"></span>
    <span class="bar bar1"></span>
  </button>
  <location />
</template>

<script setup>
import { ref, onMounted, provide , watch , inject} from 'vue';
import location from './components/location.vue';

const map = ref(null);

provide('googleMap', map) // 提供給子組件使用


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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta`;
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
      styles: mapStyle, // 使用自訂樣式
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
                    icon: {
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    }
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
</style>