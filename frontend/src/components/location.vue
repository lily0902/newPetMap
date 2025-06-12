<template>
</template>
<script setup>
import { ref, onMounted } from 'vue';

onMounted(async () => {
    try {
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
                    new googleMaps.Marker({
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




