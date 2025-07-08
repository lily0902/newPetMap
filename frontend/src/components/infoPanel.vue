<template>
    <transition name="slide">
        <div v-if="visible" 
            class="fixed top-0 left-0 h-full w-[90vw] max-w-[480px] bg-white border-r-2 border-gray-200 overflow-y-auto p-4 shadow-lg z-[99999] flex flex-col"
        >
        
        <!-- 🔹 篩選器 -->
        <div class="flex gap-2 flex-wrap mb-3">
            <button
            v-for="type in types"
            :key="type"
            :class="['px-3 py-1 rounded-full bg-gray-200 hover:bg-indigo-200 transition', selectedTypes.includes(type) ? 'bg-indigo-600 text-white' : '']"
            @click="$emit('toggleType', type)"
            >
            {{ type }}
            </button>
        </div>

        <!-- 關閉按鈕 -->
        <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-500 hover:text-black text-3xl">✕</button>

        <!-- 🔸 地點資訊 -->
        <div v-if="place" class="flex-1">
            <h2 class="text-lg font-bold mb-2">
                {{ place.displayName?.text || place.name || '未知地點' }}
            </h2>

            <!-- 照片 -->
            <div v-if="place.photos?.length">
            <img
                :src="`https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${API_KEY}&maxWidthPx=400`"
                :alt="place.displayName?.text || '地點照片'"
                class="max-w-full rounded-lg mb-3"
            />
            </div>

            <p><strong>📍 地址：</strong>
                {{ place.formattedAddress || place.vicinity || '無地址資訊' }}
            </p>

            <p><strong>📞 電話：</strong>
                {{ place.nationalPhoneNumber || place.formatted_phone_number || '無電話資訊' }}
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
            <div v-if="place.reviews?.length" class="mt-3">
                <p class="font-semibold mb-1">📝 評論：</p>
                <ul class="space-y-2">
                    <li
                        v-for="(review, idx) in place.reviews.slice(0, 3)"
                        :key="idx"
                        class="italic text-gray-700 bg-gray-100 p-3 rounded-lg"
                    >
                        ❝ {{ review.text.text }} ❞
                    </li>
                </ul>
            </div>

            <!-- 🔸 導航按鈕 -->
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
