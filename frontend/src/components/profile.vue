<template>
  <div>
    <button @click="$emit('close')" class="mb-4 text-indigo-600 hover:underline">← 返回</button>
    <h2 class="text-xl font-bold mb-2">會員資訊</h2>
    <p class="mb-1"><strong>姓名：</strong>{{ user?.username }}</p>
    <p class="mb-4"><strong>Email：</strong>{{ user?.email }}</p>
    <h3 class="text-lg font-semibold mt-4 mb-2">我的失蹤回報</h3>
    <ul class="mb-4 space-y-2">
      <li v-for="r in myReports" :key="r.id" class="bg-gray-100 rounded p-2">
        <div><strong>時間：</strong>{{ r.datetime }}</div>
        <div><strong>地點：</strong>{{ r.location }}</div>
        <div><strong>描述：</strong>{{ r.description }}</div>
        <div><strong>狀態：</strong>{{ r.status }}</div>
      </li>
    </ul>
    <!-- 我的最愛清單 -->
    <h3 class="text-lg font-semibold mb-2">我的最愛</h3>
    <ul class="space-y-2">
      <li v-for="f in favorites" :key="f.place_id" class="bg-gray-100 rounded p-2 flex items-center justify-between">
        <span>
          <button
            class="text-indigo-700 hover:underline font-semibold"
            @click="$emit('select-favorite', f.place_id)"
            type="button"
          >
            {{ f.name }}
          </button>
          <span v-if="f.address" class="text-xs text-gray-500 ml-2">{{ f.address }}</span>
        </span>
        <a
          class="text-indigo-600 hover:underline text-sm"
          :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.name)}&query_place_id=${f.place_id}`"
          target="_blank"
          rel="noopener"
        >導航</a>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const props = defineProps({
  user: Object,
  myReports: Array,
  myFavorites: Array
});
defineEmits(['close', 'select-favorite']);

const authStore = useAuthStore();
const favorites = ref([]); // [{ place_id, name, address }]

const GOOGLE_API_KEY = import.meta.env.GOOGLE_MAPS_API_KEY;

async function fetchPlaceDetail(placeId) {
  const res = await axios.get(`/api/proxy/place-details?placeId=${placeId}&language=zh-TW`, {
    headers: { Authorization: `Bearer ${authStore.token}` }
  });
  const data = res.data;
  return {
    place_id: placeId,
    name: data.result?.name || placeId,
    address: data.result?.formatted_address || ''
  };
}

onMounted(async () => {
  if (authStore.token) {
    // 1. 取得收藏的 placeId 陣列
    const res = await axios.get('/api/user/favorites', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    const placeIds = res.data.favorites || [];
    // 2. 查詢每個地點名稱
    const details = await Promise.all(
      placeIds.map(pid => fetchPlaceDetail(pid))
    );
    favorites.value = details;
  }
});
</script>
