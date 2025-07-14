<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <button @click="$emit('close')" class="mb-4 text-indigo-600 hover:underline">← 返回</button>
    <h2 class="text-xl font-bold mb-2">走失寵物資訊</h2>
    <div class="mb-1"><strong>寵物姓名：</strong>{{ report.petName || '（未填寫）' }}</div>
    <div class="mb-1"><strong>時間：</strong>{{ report.datetime }}</div>
    <div class="mb-1"><strong>地點：</strong>{{ report.location }}</div>
    <div class="mb-1"><strong>描述：</strong>{{ report.description }}</div>
    <div class="mb-1"><strong>狀態：</strong>{{ report.status }}</div>
    <img v-if="report.image" :src="`http://localhost:3000/uploads/${report.image}`" alt="回報圖片" class="max-w-[120px] rounded mt-2" />
  </div>
</template>
<script setup>
const props = defineProps({ report: Object });
</script> 