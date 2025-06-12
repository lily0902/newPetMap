<template>
</template>
<script setup>
import { watch , inject} from 'vue';

const map = inject('googleMap') //注入來自 App.vue 的 map ref





watch(map,(newMap) => {
    
});
</script>




