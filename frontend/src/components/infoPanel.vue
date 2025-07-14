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

        <!-- <Profile v-if="showProfilePanel" :user="authStore.user" :myReports="myReports" :myFavorites="myFavorites" @close="closeProfilePanel" /> -->
        <div>
        <div class="flex w-full mb-3">
            <!-- 根據登入狀態顯示不同的問候語 -->
            <div class="text-lg font-bold mr-5">
                {{ authStore.isLoggedIn ? `${authStore.user?.username || '用戶'}，您好!` : '請先登入' }}
            </div>

            <!-- 已登入時顯示的按鈕 -->
            <template v-if="authStore.isLoggedIn">
                <!-- profile按鈕 -->
                <button
                    class="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group mr-5"
                    @click="openProfilePanel "
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

                <!-- logout按鈕 -->
                <button
                    class="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-red-600 hover:bg-red-700 rounded-md group"
                    @click="handleLogout"
                >
                <span
                class="absolute w-0 h-0 transition-all duration-500 ease-out bg-red-800 rounded-full group-hover:w-56 group-hover:h-56"
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
                <span class="relative text-base font-semibold">logout</span>
                </button>
            </template>

            <!-- 未登入時顯示的按鈕 -->
            <template v-else>
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
            </template>
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
            <button
              class="px-3 py-1 rounded-full bg-red-200 hover:bg-red-400 text-red-800"
              @click="$emit('show-lost-pet')"
            >走失</button>
        </div>
        <!-- 根據 showLostPet prop 插入 lostPet.vue -->
        <LostPet v-if="showLostPet" />
        <!-- 地點資訊只在沒顯示 lostPet 時顯示 -->
        <LocationInfo v-else-if="!showProfilePanel" :place="displayPlace" :API_KEY="API_KEY" @show-place-info="$emit('show-place-info')" />
        <!-- Profile 放在篩選器下方 -->
        <Profile
          v-if="showProfilePanel"
          :user="authStore.user"
          :myReports="myReports"
          :myFavorites="myFavorites"
          @close="closeProfilePanel"
          @select-favorite="handleSelectFavorite"
        />
        <!-- 關閉按鈕 -->
        <button @click="$emit('close')" class="absolute top-3 right-3 text-gray-500 hover:text-black text-3xl">✕</button>
      </div>
      </div>
    </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import LocationInfo from './locationInfo.vue';
import Profile from './profile.vue';
import axios from 'axios';
import LostPet from './lostPet.vue';

const router = useRouter();
const authStore = useAuthStore();

const showProfilePanel = ref(false);
const place = ref(null); // 用於 LocationInfo 顯示

function openProfilePanel() {
  showProfilePanel.value = true;
}
function closeProfilePanel() {
  showProfilePanel.value = false;
}

// 假資料：失蹤回報
const myReports = ref([
  { id: 1, datetime: '2024-05-01T10:00', location: '台北市信義區', description: '黑色柴犬，脖子有紅色項圈', image: '', status: '尋找中' },
  { id: 2, datetime: '2024-04-20T15:30', location: '新北市板橋區', description: '橘貓，尾巴有白色斑點', image: '', status: '已尋回' }
]);
// 假資料：我的最愛
const myFavorites = ref([
  { id: 'place1', name: '寵物友善餐廳A' },
  { id: 'place2', name: '寵物醫院B' }
]);

const props = defineProps({
    visible: Boolean,
    place: Object,
    types: Array,
    selectedTypes: Array,
    showLostPet: Boolean // 新增
});

const localPlace = ref(null); // 只給我的最愛用
const displayPlace = computed(() => localPlace.value || props.place);

// 當地標被點擊（props.place 變動），自動清空 localPlace，顯示地標資訊
watch(() => props.place, (newVal) => {
  if (newVal) {
    localPlace.value = null;
  }
});

defineEmits(['close', 'toggleType', 'show-lost-pet', 'show-place-info']);

// ✅ 匯入 Google Maps API Key
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 處理登出功能
const handleLogout = () => {
    authStore.logout();
    //router.push('/login');
};

async function handleSelectFavorite(placeId) {
  try {
    const res = await axios.get(`/api/proxy/place-details?placeId=${placeId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    localPlace.value = res.data.result;
    showProfilePanel.value = false;
  } catch (e) {
    alert('查詢地點資訊失敗');
  }
}
</script>
