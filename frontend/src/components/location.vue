<template>
</template>
<script setup>
import { watch, inject, defineProps } from 'vue';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();

// 取得地圖實例
const mapInstance = mapStore.map;

// 取得使用者位置
const userLoc = mapStore.userLocation;

//const map = inject('googleMap') //注入來自 App.vue 的 map ref

const markers = {
    hospitals: [], // 存放寵物醫院的標記
    restaurants: [], // 存放餐廳的標記
    hotels: [] // 存放住宿的標記
};



watch(() => mapStore.map, (newMap) => {
    if (!newMap) return; // 如果地圖尚未初始化，則不執行後續操作

    // 清除舊標記 (避免載到舊資料)
    markers.hospitals.forEach(marker => marker.map = null);
    markers.hospitals = [];

    // // 使用 PlacesService 進行搜尋
    // const service = new google.maps.places.PlacesService(newMap); // 正確使用 map 實例
  
    // // 搜尋寵物醫院
    // const hospitalRequest = {
    //     location: mapStore.userLocation,
    //     radius: '50000',
    //     keyword: '寵物醫院'
    // };

    // service.nearbySearch(hospitalRequest, (results, status) => {
    //     if (status === google.maps.places.PlacesServiceStatus.OK) {
    //         for (let i = 0; i < results.length; i++) {
    //             const marker = createMarker(results[i], '醫院'); // 創建地標
    //             //marker.setMap(null); // 隱藏醫院的標記
    //             marker.setMap(newMap); // 將醫院的標記添加到地圖上
    //             markers.hospitals.push(marker); // 將醫院的地標儲存到陣列
    //         }
    //     }
    // });
});
</script>




