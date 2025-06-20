<template>
  <transition name="slide">
    <div v-if="visible" class="info-panel">
      <!-- 🔹 篩選器 -->
      <!-- 上方：篩選器 -->
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
        <h2 class="text-lg font-bold mb-2">{{ place.displayName?.text || place.name }}</h2>

        <div v-if="place.photos?.length">
          <img
            :src="`https://places.googleapis.com/v1/${place.photos[0].name}/media?key=AIzaSyBfC4H3RT-whyYWCRCwB3c4WsgYgT2Oqww&maxWidthPx=400`"
            alt="地點照片"
        <button
          @click="$emit('close')"
          class="close-btn"
          aria-label="關閉資訊面板"
          title="關閉資訊面板"
        >
          ✕
        </button>
      </div>

      <!-- 下方：地點資訊 -->
      <div v-if="place" class="place-info">
        <h2 class="place-name">{{ place.name }}</h2>

        <div v-if="place.photos?.length" class="photo-wrapper">
          <img
            :src="place.photos[0].getUrl({ maxWidth: 450 })"
            :alt="place.name"
            class="place-photo"
          />
        </div>

        <p><strong>📍 地址：</strong>{{ place.formattedAddress || '無地址資訊' }}</p>
        <p><strong>📞 電話：</strong>{{ place.formattedPhoneNumber || '無電話資訊' }}</p>
        <p><strong>🕒 營業時間：</strong>
          <span v-if="place.currentOpeningHours">
            {{ place.currentOpeningHours.openNow ? '營業中' : '休息中' }}
          </span>
          <span v-else>未知</span>
        </p>
        <p><strong>⭐ 評分：</strong>{{ place.rating ? place.rating.toFixed(1) : '無評分' }}</p>

        <!-- 🔸 評論 -->
        <div v-if="place.reviews?.length">
          <p><strong>📝 評論：</strong></p>
          <ul>
            <li v-for="(review, idx) in place.reviews.slice(0, 2)" :key="idx">
          <span class="label">📍 地址：</span>
          <span class="value">{{ place.vicinity || '無地址資訊' }}</span>
        </div>

        <div class="info-row">
          <span class="label">🕒 營業時間：</span>
          <span class="value">{{ place.opening_hours?.open_now ? '營業中' : '休息中' }}</span>
        </div>

        <div class="info-row">
          <span class="label">📞 電話：</span>
          <span class="value">{{ place.formatted_phone_number || '無電話資訊' }}</span>
        </div>

        <div class="info-row">
          <span class="label">⭐ 評分：</span>
          <span class="value">{{ place.rating ? place.rating.toFixed(1) : '無評分' }}</span>
        </div>

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
          v-if="place.place_id"
          class="navigate-button"
          :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.displayName?.text || place.name)}&destination_place_id=${place.place_id}`"
          target="_blank"
        <a
          :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name)}&destination_place_id=${place.place_id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="navigate-button"
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
  selectedTypes: Array,
});
defineEmits(['close', 'toggleType']);
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
  padding: 20px;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
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
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}

.filter-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 8px 16px;
  border-radius: 9999px;
  background: #eee;
  cursor: pointer;
  border: none;
  font-weight: 600;
  user-select: none;
  transition: background-color 0.3s ease;
  color: #555;
}

.filter-btn.active {
  background: #7c3aed;
  color: white;
}

.place-info img.place-photo {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
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
.place-name {
  margin-bottom: 16px;
  font-size: 1.6rem;
  font-weight: 700;
  color: #4a3aff;
  line-height: 1.3;
}

.photo-wrapper {
  margin-bottom: 18px;
}

.place-photo {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(124, 58, 237, 0.2);
}

.info-row {
  display: flex;
  margin-bottom: 12px;
  font-size: 1rem;
  line-height: 1.4;
}

.label {
  min-width: 80px;
  font-weight: 700;
  color: #6b6b6b;
}

.value {
  flex: 1;
  color: #444;
}

.reviews-section {
  margin-top: 24px;
}

.section-title {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #444;
}

.review-item {
  font-style: italic;
  margin-bottom: 10px;
  border-left: 4px solid #7c3aed;
  padding-left: 12px;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.3;
}

.navigate-button {
  display: block;
  margin-top: 28px;
  background: #7c3aed;
  color: white;
  padding: 14px 0;
  border-radius: 12px;
  text-align: center;
  font-weight: 700;
  text-decoration: none;
  user-select: none;
  box-shadow: 0 6px 12px rgba(124, 58, 237, 0.3);
  transition: background-color 0.3s ease;
}

.navigate-button:hover {
  background: #5a22c9;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 22px;
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #444;
}
</style>
