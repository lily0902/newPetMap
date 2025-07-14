<template>
  <div v-if="place" class="flex-1">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg font-bold">
        {{ place.name || place.displayName?.text || '未知地點' }}
      </h2>
      <!-- 愛心按鈕 -->
      <div class="heart-container mr-10 ml-5" title="Like">
        <input v-if="props.place" type="checkbox" class="checkbox" id="Give-It-An-Id" :checked="isFavorite" @change="toggleFavorite">
        <div class="svg-container">
          <svg viewBox="0 0 24 24" class="svg-outline" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
          </path>
        </svg>
        <svg viewBox="0 0 24 24" class="svg-filled" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
          </path>
        </svg>
        <svg class="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10,10 20,20"></polygon>
          <polygon points="10,50 20,50"></polygon>
          <polygon points="20,80 30,70"></polygon>
          <polygon points="90,10 80,20"></polygon>
          <polygon points="90,50 80,50"></polygon>
          <polygon points="80,80 70,70"></polygon>
        </svg>
      </div>
    </div>
   </div>
    
    
    <!-- 照片 -->
    <div v-if="place.photos?.length">
      <img
        :src="getPhotoUrl(place)"
        :alt="place.name || place.displayName?.text || '地點照片'"
        class="max-w-full rounded-lg mb-3"
      />
    </div>
    <p><strong>📍 地址：</strong>
      {{ place.formatted_address || place.formattedAddress || place.vicinity || '無地址資訊' }}
    </p>
    <p><strong>📞 電話：</strong>
      {{ place.formatted_phone_number || place.nationalPhoneNumber || '無電話資訊' }}
    </p>
    <p><strong>🕒 營業時間：</strong>
      <span v-if="place.opening_hours">
        {{ place.opening_hours.open_now ? '營業中' : '休息中' }}
      </span>
      <span v-else-if="place.currentOpeningHours">
        {{ place.currentOpeningHours.openNow ? '營業中' : '休息中' }}
      </span>
      <span v-else>未知</span>
    </p>
    <!-- <div v-if="place.opening_hours?.weekday_text || place.currentOpeningHours?.weekdayText">
      <ul class="text-sm text-gray-600">
        <li v-for="(t, i) in (place.opening_hours?.weekday_text || place.currentOpeningHours?.weekdayText)" :key="i">{{ t }}</li>
      </ul>
    </div> -->
    <p><strong>⭐ 評分：</strong>
      {{ place.rating ? place.rating.toFixed(1) : '無評分' }}
    </p>
    <!-- 評論 -->
    <div v-if="place.reviews?.length" class="mt-3">
      <p class="font-semibold mb-1">📝 評論：</p>
      <ul class="space-y-2">
        <li
          v-for="(review, idx) in place.reviews.slice(0, 3)"
          :key="idx"
          class="italic text-gray-700 bg-gray-100 p-3 rounded-lg"
        >
          ❝ {{ review.text?.text || review.text || '' }} ❞
        </li>
      </ul>
    </div>
    <!-- 導航按鈕 -->
    <a
      v-if="place.place_id || place.id"
      class="block mt-3 bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-center font-semibold transition"
      :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.displayName?.text || place.name || '')}&destination_place_id=${place.place_id || place.id}`"
      target="_blank"
      rel="noopener noreferrer"
    >
      🚗 前往導航
    </a>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  place: Object,
  API_KEY: String
});

const authStore = useAuthStore();

const placeId = computed(() =>
  props.place ? (props.place.place_id || props.place.id) : ''
);

const isFavorite = computed(() =>
  props.place &&
  Array.isArray(authStore.user?.favorites) &&
  authStore.user.favorites.includes(placeId.value)
);

async function toggleFavorite() {
  if (!authStore.user || !props.place) {
    alert('請先登入且需有地點才能收藏');
    return;
  }
  const method = isFavorite.value ? 'DELETE' : 'POST';
  await fetch('/api/user/favorite', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    },
    body: JSON.stringify({ placeId: placeId.value })
  });
  // 本地同步 user.favorites
  if (!Array.isArray(authStore.user.favorites)) authStore.user.favorites = [];
  if (method === 'POST') {
    if (!authStore.user.favorites.includes(placeId.value)) {
      authStore.user.favorites.push(placeId.value);
    }
  } else {
    authStore.user.favorites = authStore.user.favorites.filter(id => id !== placeId.value);
  }
}

function getPhotoUrl(place) {
  // 舊版 API
  if (place.photos && place.photos[0]?.photo_reference) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${props.API_KEY}`;
  }
  // 新版 API
  if (place.photos && place.photos[0]?.name) {
    return `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${props.API_KEY}&maxWidthPx=400`;
  }
  return '';
}
</script>
<style scoped>
  .heart-container {
    --heart-color: rgb(255, 91, 137);
    position: relative;
    min-width: 25px;
    height: 25px;
    transition: .3s;
  }

  .heart-container .checkbox {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 20;
    cursor: pointer;
  }

  .heart-container .svg-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .heart-container .svg-outline,
          .heart-container .svg-filled {
    fill: var(--heart-color);
    position: absolute;
  }

  .heart-container .svg-filled {
    animation: keyframes-svg-filled 1s;
    display: none;
  }

  .heart-container .svg-celebrate {
    position: absolute;
    animation: keyframes-svg-celebrate .5s;
    animation-fill-mode: forwards;
    display: none;
    stroke: var(--heart-color);
    fill: var(--heart-color);
    stroke-width: 2px;
  }

  .heart-container .checkbox:checked~.svg-container .svg-filled {
    display: block
  }

  .heart-container .checkbox:checked~.svg-container .svg-celebrate {
    display: block
  }

  @keyframes keyframes-svg-filled {
    0% {
      transform: scale(0);
    }

    25% {
      transform: scale(1.2);
    }

    50% {
      transform: scale(1);
      filter: brightness(1.5);
    }
  }

  @keyframes keyframes-svg-celebrate {
    0% {
      transform: scale(0);
    }

    50% {
      opacity: 1;
      filter: brightness(1.5);
    }

    100% {
      transform: scale(1.4);
      opacity: 0;
      display: none;
    }
  }
</style>
