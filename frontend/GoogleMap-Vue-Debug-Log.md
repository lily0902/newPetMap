# Vue + Google Maps API 開發常見困境與解決紀錄

## 1. 狀況描述
- 使用 Vue 3 + Vite + Pinia + Google Maps API 開發地圖應用。
- 需求：根據使用者篩選（activeTypes: 醫院、餐廳、住宿）動態顯示/隱藏不同類型的地標（marker），且切換時不重建 marker、不閃爍。

## 2. 主要困難點
- **marker 無法正確 show/hide**：切換篩選時，marker 沒有如預期消失或出現。
- **setMap(null) 無效**：即使呼叫 marker.setMap(null)，地圖上的 marker 依然存在。
- **map instance 不一致**：marker 綁定的 map instance 和畫面上的 map instance 不一致，導致操作無效。
- **Vue/Pinia Proxy 問題**：map 或 marker 被 Vue 的 reactivity 系統包裝，導致 === 比較失敗。
- **Google Maps API 新版 setMap(null) 不隱藏**：新版 API 需同時呼叫 setVisible(false)。

## 3. 解決步驟與重點

### (1) map 實例管理
- 只在 onMounted/new map 時建立一次 map instance，並用 Pinia store 的 module 變數（非 ref/reactive）全域管理：
  **錯誤寫法（容易出現 Proxy 問題）**
  ```js
  // stores/mapStore.js
  import { ref } from 'vue';
  export const useMapStore = defineStore('map', () => {
    const map = ref(null); // ❌ 不要用 ref/reactive 存 map instance
    function setMap(mapInstance) { map.value = mapInstance; }
    function getMap() { return map.value; }
    return { map, setMap, getMap };
  });
  ```
  **正確寫法**
  ```js
  // stores/mapStore.js
  let map = null;
  export const useMapStore = defineStore('map', {
    actions: {
      setMap(mapInstance) { map = mapInstance; },
      getMap() { return map; }
    }
  });
  ```

### (2) marker 建立與顯示/隱藏
- marker 只用 mapStore.getMap() 拿 map 實例來建立與 setMap。
- 切換篩選時，只呼叫 marker.setMap(map) 或 marker.setMap(null)（不重建 marker）。
- 新版 Google Maps API 下，需同時呼叫 marker.setVisible(true/false)：
  **錯誤寫法（只呼叫 setMap）**
  ```js
  // 只呼叫 setMap，部分新版 API marker 不會隱藏
  marker.setMap(null); // ❌
  marker.setMap(map); // ❌
  ```
  **正確寫法**
  ```js
  marker.setMap(map); // 顯示
  if (typeof marker.setVisible === 'function') marker.setVisible(true);
  marker.setMap(null); // 隱藏
  if (typeof marker.setVisible === 'function') marker.setVisible(false);
  ```

### (3) Proxy 問題
- 即使 marker.getMap() === mapStore.getMap() 為 false，只要物件內容一致即可。
- 只要功能正常，=== false 可忽略。
- **什麼是『被 Vue 的 reactivity 系統包裝』？**
  - 當你用 `ref()`、`reactive()` 或把物件放進 Pinia state 時，Vue 會用 Proxy 包裝這個物件，讓它變成「可追蹤變化」的響應式物件。
  - 這個 Proxy 會攔截 get/set 操作，讓 Vue 能追蹤依賴、觸發畫面更新。
  - 你在 console.log 看到的 `Proxy(_.fr)` 就是這種被包裝過的物件。
  - 這種 Proxy 物件和原生物件記憶體位址不同，所以 `===` 比較會是 false，但方法和屬性都會自動轉發給原生物件。
  - **Google Maps API 只認得原生物件，但 Proxy 會自動轉發，大多數情況下沒問題。**
  - 只要你用的是同一個 map instance（即使被 Proxy 包裝），Google Maps API 的功能都會正常。
  - 建議：不要用 `===` 來判斷 map/marker 是否相等，只要功能正常即可。

### (4) Debug 方法
- 將 marker 陣列與 mapStore 掛到 window，方便在 console 直接操作：
  ```js
  window.hotelMarkers = hotelMarkers;
  window.restaurantMarkers = restaurantMarkers;
  window.hospitalMarkers = hospitalMarkers;
  window.mapStore = mapStore;
  ```
- 在 updateMarkersVisibility 內加 log，觀察 activeTypes、marker 狀態。

## 4. 最終驗證方式
- 切換篩選時，marker 能正確 show/hide。
- 在 console 執行 hotelMarkers.value[0].getMap()、mapStore.getMap()，物件內容一致。
- marker.setMap(null) + setVisible(false) 時 marker 會消失。

## 5. 其他注意事項
- 確保全專案只 new 一次 google.maps.Map。
- marker 陣列長度、內容要與實際地圖一致。
- icon 路徑正確，避免 marker 實際存在但不可見。
- 若遇到 marker 疊在一起，檢查是否有重複建立。

---

> 本文件可作為日後維護、debug Google Maps + Vue 專案的參考。 

## GoogleMap 我的最愛與地標資訊顯示問題與解決方法

### 1. 我的最愛顯示資訊與地標點擊不一致
**問題描述：**
- 我的最愛點擊後顯示的資訊（如地址、營業時間、評論等）比地標點擊時少，或格式不同。

**解決方法：**
- 我的最愛只存 placeId，點擊時用 placeId 查詢 Google Places 詳細資料（後端 proxy API），傳給顯示組件（LocationInfo.vue）。
- LocationInfo.vue 統一吃 Google Places 詳細資料格式，無論來源。

---

### 2. 我的最愛顯示英文、地標顯示中文
**問題描述：**
- 我的最愛點擊後顯示的資訊是英文，地標點擊則是中文。

**解決方法：**
- 後端 proxy API `/api/proxy/place-details` 支援 `language` 參數，預設 `zh-TW`。
- 前端 axios 請求時加上 `language=zh-TW`，確保回傳中文內容。

---

### 3. 如何統一顯示格式
**問題描述：**
- 不同來源（我的最愛/地標）欄位名稱或格式不同，導致顯示不一致。

**解決方法：**
- LocationInfo.vue 所有顯示欄位都優先用舊版 Google Places API 欄位（如 name、formatted_address、opening_hours、reviews），若無則 fallback 到新版欄位（如 displayName.text、formattedAddress、currentOpeningHours 等）。
- 實作 `getPhotoUrl` 方法，根據欄位自動選擇正確的圖片 API。

---

### 4. 如何切換顯示來源（我的最愛/地標）
**問題描述：**
- 點擊我的最愛後顯示該地點資訊，但點擊地標時希望自動切換顯示地標資訊。

**解決方法：**
- infoPanel.vue 維護 localPlace 狀態（我的最愛點擊時設置），displayPlace 為 localPlace 或 props.place。
- 監聽 props.place 變動，若有新地標被點擊，自動清空 localPlace，顯示地標資訊。

---

### 5. 點地標時自動隱藏我的最愛資訊
**問題描述：**
- 點擊我的最愛後顯示資訊，若再點地標，仍殘留我的最愛資訊。

**解決方法：**
- 在 infoPanel.vue 使用 watch 監聽 props.place，當地標被點擊（props.place 變動且非空）時，將 localPlace.value 設為 null，確保顯示內容切換為地標資訊。

---

**總結：**
- 我的最愛與地標點擊顯示資訊已完全統一，且語言、格式、切換行為皆符合預期。
- 若需擴充顯示欄位或支援更多語系，僅需調整 proxy API 及 LocationInfo.vue 欄位對應即可。 