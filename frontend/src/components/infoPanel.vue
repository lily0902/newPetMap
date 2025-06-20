<template>
  <transition name="slide">
    <div v-if="visible" class="info-panel">
      <!-- 🔹 篩選器 -->
      <div class="filter-section">
        <button
          v-for="type in types"
          :key="type"
          :class="['filter-btn', selectedTypes.includes(type) ? 'active' : '']"
          @click="$emit('toggleType', type)"
        >
          {{ type }}
        </button>
      </div>

      <!-- 🔸 地點資訊 -->
      <div v-if="place" class="place-info">
        <h2 class="text-lg font-bold mb-2">
          {{ place.displayName?.text || place.name || '未知地點' }}
        </h2>

        <!-- 照片 -->
        <div v-if="place.photos?.length">
          <img
            :src="`https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${API_KEY}&maxWidthPx=400`"
            :alt="place.displayName?.text || '地點照片'"
            class="place-photo"
          />
        </div>

        <p><strong>📍 地址：</strong>
          {{ place.formattedAddress || place.vicinity || '無地址資訊' }}
        </p>

        <p><strong>📞 電話：</strong>
          {{ place.formattedPhoneNumber || place.formatted_phone_number || '無電話資訊' }}
        </p>

        <p><strong>🕒 營業時間：</strong>
          <span v-if="place.currentOpeningHours">
            {{ place.currentOpeningHours.openNow ? '營業中' : '休息中' }}
          </span>
          <span v-else-if="place.opening_hours">
            {{ place.opening_hours.open_now ? '營業中' : '休息中' }}
          </span>
          <span v-else>未知</span>
        </p>

        <p><strong>⭐ 評分：</strong>
          {{ place.rating ? place.rating.toFixed(1) : '無評分' }}
        </p>

        <!-- 🔸 評論 -->
        <div v-if="place.reviews?.length" class="reviews-section">
          <p class="section-title">📝 評論：</p>
          <ul>
            <li
              v-for="(review, idx) in place.reviews.slice(0, 2)"
              :key="idx"
              class="review-item"
            >
              ❝ {{ review.text }} ❞
            </li>
          </ul>
        </div>

        <!-- 🔸 導航按鈕 -->
        <a
          v-if="place.place_id || place.id"
          class="navigate-button"
          :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.displayName?.text || place.name || '')}&destination_place_id=${place.place_id || place.id}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          🚗 前往導航
        </a>

        <!-- 關閉按鈕 -->
        <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: Boolean,
  place: Object,
  types: Array,
  selectedTypes: Array
});

defineEmits(['close', 'toggleType']);

// ✅ 匯入 Google Maps API Key
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
</script>

<style scoped>
.info-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100%;
  background: white;
  border-right: 2px solid #eee;
  overflow-y: auto;
  padding: 16px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}

.filter-section {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.filter-btn {
  padding: 6px 12px;
  border-radius: 9999px;
  background: #eee;
  cursor: pointer;
}
.filter-btn.active {
  background: #7c3aed;
  color: white;
}

.place-photo {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}

.reviews-section {
  margin-top: 12px;
}
.review-item {
  margin-bottom: 8px;
  font-style: italic;
  color: #444;
}

.navigate-button {
  margin-top: 12px;
  background: #8b5cf6;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  display: block;
  text-align: center;
  text-decoration: none;
}
</style>
