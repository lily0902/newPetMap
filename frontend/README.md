# Vue 3 + Vite

本專案為 Vue 3 + Vite 建構的前端專案，結合 Google Maps API，並以 Pinia 管理狀態。

## 專案結構說明

```
frontend/
├── index.html                # 專案入口 HTML，掛載 Vue app
├── package.json              # 專案依賴與腳本
├── vite.config.js            # Vite 設定檔
├── tailwind.config.js        # Tailwind 設定檔
├── postcss.config.js         # PostCSS 設定檔
├── README.md                 # 專案說明文件
├── public/
│   └── assets/
│       └── icons/            # 各類地標圖示（醫院、餐廳、住宿、搜尋）
│       └── vue.svg           # Vue 標誌
├── src/
│   ├── App.vue               # 主組件，地圖與搜尋、篩選 UI
│   ├── main.js               # 入口 JS，掛載 Vue app
│   ├── style.css             # 全域樣式（含 Tailwind）
│   ├── assets/
│   │   └── icons/            # 前端用的地標圖示
│   ├── components/
│   │   └── infoPanel.vue     # 地點詳細資訊面板元件
│   │   └── login.vue        # 登入頁面元件
│   │   └── signUp.vue       # 註冊頁面元件
│   │   └── forgotPassword.vue # 忘記密碼頁面元件
│   ├── composables/
│   │   └── useGeolocation.js # 取得與追蹤使用者定位的組合式函式
│   │   └── usePlacesLoader.js# Google Maps 地點查詢與標記管理
│   ├── stores/
│   │   └── locationStore.js  # Pinia 狀態：管理使用者定位
│   │   └── mapStore.js       # Pinia 狀態：管理地圖實例與相關狀態
```

## 主要目錄與檔案用途

- `index.html`：專案入口 HTML，載入 Tailwind 與 Vue app。
- `public/assets/icons/`：存放地圖標記用的 PNG 圖示（醫院、餐廳、住宿、搜尋等）。
- `src/App.vue`：主畫面，包含地圖、搜尋欄、篩選器、資訊面板等。
- `src/components/infoPanel.vue`：顯示地點詳細資訊的側邊面板。
- `src/components/login.vue`：登入頁面，支援 email/password 登入，並有「忘記密碼」與「註冊」導頁連結。
- `src/components/signUp.vue`：註冊頁面，支援新用戶註冊，並有「登入」與「忘記密碼」導頁連結。
- `src/components/forgotPassword.vue`：忘記密碼頁面，支援 email 填寫與送出，並有「註冊」導頁連結。
- `src/composables/useGeolocation.js`：取得並監聽使用者地理位置。
- `src/composables/usePlacesLoader.js`：Google Maps API 地點查詢、標記建立與管理。
- `src/stores/locationStore.js`：Pinia 狀態，儲存與設定使用者定位。
- `src/stores/mapStore.js`：Pinia 狀態，儲存地圖實例與相關操作。
- `src/style.css`：全域樣式，含 Tailwind 設定。
- `tailwind.config.js`：Tailwind CSS 設定檔。
- `postcss.config.js`：PostCSS 設定檔。
- `vite.config.js`：Vite 設定檔。

## 開發建議
- 進入 `src/` 目錄，從 `App.vue` 開始閱讀主流程。
- 若需擴充地標類型，請參考 `usePlacesLoader.js` 與 `App.vue` 內的 `ALL_TYPES` 設定。
- 若需調整地圖行為，請參考 `mapStore.js` 與 `useGeolocation.js`。

## SPA 路由與登入/註冊/忘記密碼頁面

本專案採用 Vue Router 實現單頁應用（SPA）結構，主要路由如下：

- `/`：首頁（Home.vue）
- `/login`：登入頁面（login.vue）
- `/signUp`：註冊頁面（signUp.vue）
- `/forgotPassword`：忘記密碼頁面（forgotPassword.vue）

### 路由設定檔
路由定義於 `src/router/index.js`，可依需求擴充。

#### router/index.js 範例
```js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/login.vue'
import SignUp from '../components/signUp.vue'
import ForgotPassword from '../components/forgotPassword.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/signUp', component: SignUp },
  { path: '/forgotPassword', component: ForgotPassword }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

#### main.js 掛載 router 範例
```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

### 導頁方式
各頁面間的導頁均使用 `vue-router` 的 `router.push()` 方法，範例：

```vue
<a href="#" @click.prevent="router.push('/signUp')">Sign up</a>
```

### 登入/註冊/忘記密碼元件說明
- **login.vue**：
  - Email/Password 輸入欄位
  - 「Forgot Password?」連結導向 `/forgotPassword`
  - 「Sign up」連結導向 `/signUp`
- **signUp.vue**：
  - Username/Email/Password 輸入欄位
  - 「Forgot Password?」連結導向 `/forgotPassword`
  - 「Log in」連結導向 `/login`
- **forgotPassword.vue**：
  - Email 輸入欄位
  - 「Sign up」連結導向 `/signUp`

所有元件皆以 Tailwind CSS utility class 為主，無需自訂 CSS。

---

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
