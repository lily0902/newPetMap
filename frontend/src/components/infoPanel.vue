<template>
    
    <!--
      InfoPanel 進場/離場動畫說明（Tailwind CSS）：

      - enter-active-class: 進場動畫時啟用 transform 動畫，持續 400ms
      - enter-from-class:   進場動畫開始，X 軸向左滑出畫面（-100%），完全透明
      - enter-to-class:     進場動畫結束，X 軸歸零，完全不透明
      - leave-active-class: 離場動畫時啟用 transform 動畫，持續 400ms
      - leave-from-class:   離場動畫開始，原位且不透明
      - leave-to-class:     離場動畫結束，X 軸向左滑出畫面且透明

      這些 class 均為 Tailwind CSS 實現，讓 infoPanel 由左滑入、滑出並有淡入淡出效果。
    -->
    <transition
      enter-active-class="transition-transform duration-400"
      enter-from-class="-translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition-transform duration-400"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="-translate-x-full opacity-0"
    >
        <div v-if="visible" 
            class="fixed top-0 left-0 h-full w-[90vw] max-w-[480px] bg-white border-r-2 border-gray-200 overflow-y-auto p-4 shadow-2xl  flex flex-col z-20"
        >

        <div class="flex w-full mb-3">
            <div class="text-lg font-bold mr-5">林欣，您好!</div>

            <!-- profile按鈕 -->
            <button
                class="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group mr-5"
                @click="router.push('/login')"
            >
            <span
            class="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"
            ></span>
            <span class="absolute bottom-0 left-0 h-full -ml-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-auto h-full opacity-100 object-stretch"
                    viewBox="0 0 487 487"
                >
                    <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                    ></path>
                </svg>
            </span>
            <span class="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="object-cover w-full h-full"
                    viewBox="0 0 487 487"
                >
                    <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                    ></path>
                </svg>
            </span>
            <span
                class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"
            ></span>
            <span class="relative text-base font-semibold">profile</span>
            </button>
            
            <!-- login按鈕 -->
            <button
                class="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group"
                @click="router.push('/login')"
            >
            <span
            class="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"
            ></span>
            <span class="absolute bottom-0 left-0 h-full -ml-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-auto h-full opacity-100 object-stretch"
                    viewBox="0 0 487 487"
                >
                    <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"
                    ></path>
                </svg>
            </span>
            <span class="absolute top-0 right-0 w-12 h-full -mr-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="object-cover w-full h-full"
                    viewBox="0 0 487 487"
                >
                    <path
                    fill-opacity=".1"
                    fill-rule="nonzero"
                    fill="#FFF"
                    d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"
                    ></path>
                </svg>
            </span>
            <span
                class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"
            ></span>
            <span class="relative text-base font-semibold">Login</span>
            </button>
        </div>

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
import { useRouter } from 'vue-router';
const router = useRouter();

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
