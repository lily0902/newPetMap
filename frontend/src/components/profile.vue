<template>
  <div>
    <button @click="$emit('close')" class="mb-4 text-indigo-600 hover:underline">← 返回</button>
    <h2 class="text-xl font-bold mb-2">會員資訊</h2>
    <p class="mb-1"><strong>姓名：</strong>{{ user?.username }}</p>
    <p class="mb-4"><strong>Email：</strong>{{ user?.email }}</p>
    <h3 class="text-lg font-semibold mt-4 mb-2">我的失蹤回報</h3>
    <ul class="mb-4 space-y-2">
      <li v-for="r in myReports" :key="r._id" class="bg-gray-100 rounded p-2 flex justify-between items-center">
        <div>
          <div><strong>寵物姓名：</strong>{{ r.petName || '（未填寫）' }}</div>
          <div><strong>時間：</strong>{{ r.datetime }}</div>
          <div><strong>地點：</strong>{{ r.location }}</div>
          <div><strong>描述：</strong>{{ r.description }}</div>
          <div><strong>狀態：</strong>{{ r.status }}</div>
          <img v-if="r.image" :src="`http://localhost:3000/uploads/${r.image}`" alt="回報圖片" class="max-w-[120px] rounded mt-2" />
        </div>
        <button @click="deleteReport(r._id)" class="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">刪除</button>
      </li>
    </ul>
    <!-- 我的最愛清單 -->
    <h3 class="text-lg font-semibold mb-2">我的最愛</h3>
    <ul class="space-y-2">
      <li v-for="f in favorites" :key="f.place_id" class="bg-gray-100 rounded p-2 flex items-center  justify-between">
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
          class="text-indigo-600 hover:underline text-sm ml-10  whitespace-nowrap"
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
const myReports = ref([]);

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

async function fetchMyReports() {
  if (authStore.token) {
    const res = await axios.get('/api/my-missing-reports', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    myReports.value = res.data.reports || [];
  }
}

async function deleteReport(id) {
  if (!confirm('確定要刪除這筆回報嗎？')) return;
  await axios.delete(`/api/my-missing-reports/${id}`, {
    headers: { Authorization: `Bearer ${authStore.token}` }
  });
  myReports.value = myReports.value.filter(r => r._id !== id);
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
    // 3. 取得我的失蹤回報
    await fetchMyReports();
  }
});
</script>
