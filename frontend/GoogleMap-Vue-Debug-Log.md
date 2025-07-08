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