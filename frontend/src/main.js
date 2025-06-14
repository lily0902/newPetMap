import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'

const app = createApp(App);

app.use(createPinia()); // 註冊 Pinia

app.mount('#app');