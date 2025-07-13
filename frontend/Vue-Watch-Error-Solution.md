# Vue Watch 函數中 stop 變數作用域問題解決方案

## 問題描述

在 Vue 3 的 `watch` 函數中，當使用 `immediate: true` 選項時，遇到了以下錯誤：

```
Vue warn]: Unhandled error during execution of watcher callback
Vue warn]: Unhandled error during execution of scheduler flush
ReferenceError: Cannot access 'stop' before initialization
```

## 錯誤代碼

```javascript
await new Promise((resolve) => {
  const stop = watch(
    () => locationStore.userLocation,
    (loc) => {
      if (loc.lat && loc.lng) {
        stop(); // ❌ 這裡會出錯
        resolve();
      }
    },
    { immediate: true } // 立即執行回調
  );
});
```

## 問題原因

1. **變數提升問題**：使用 `const stop` 宣告時，在 `immediate: true` 的情況下，回調函數會立即執行
2. **作用域衝突**：當回調立即執行時，`stop` 變數可能還沒被完全初始化
3. **時序問題**：`watch` 函數返回的 `stop` 函數在回調執行時可能還不存在

## 解決方案

### 方案一：使用 let 宣告並安全調用

```javascript
await new Promise((resolve) => {
  let stop = null;
  stop = watch(
    () => locationStore.userLocation,
    (loc) => {
      if (loc.lat && loc.lng) {
        if (stop) stop(); // ✅ 安全調用
        resolve();
      }
    },
    { immediate: true }
  );
});
```

### 方案二：使用 setTimeout 延遲執行

```javascript
await new Promise((resolve) => {
  const stop = watch(
    () => locationStore.userLocation,
    (loc) => {
      if (loc.lat && loc.lng) {
        setTimeout(() => {
          stop();
          resolve();
        }, 0);
      }
    },
    { immediate: true }
  );
});
```

### 方案三：避免 immediate 選項

```javascript
await new Promise((resolve) => {
  const stop = watch(
    () => locationStore.userLocation,
    (loc) => {
      if (loc.lat && loc.lng) {
        stop();
        resolve();
      }
    }
    // 移除 immediate: true
  );
  
  // 手動檢查初始值
  if (locationStore.userLocation.lat && locationStore.userLocation.lng) {
    stop();
    resolve();
  }
});
```

## 推薦解決方案

**使用方案一**，因為：
- 代碼簡潔易懂
- 不需要額外的延遲
- 保持了 `immediate: true` 的功能
- 安全可靠

## 相關知識點

### Vue 3 Watch 函數
- `watch` 函數返回一個 `stop` 函數，用於停止監聽
- `immediate: true` 會立即執行一次回調函數
- 在 `setup` 函數中，變數宣告的順序很重要

### JavaScript 變數提升
- `const` 和 `let` 不會提升，但會進入暫時性死區
- 在變數宣告之前訪問會拋出 `ReferenceError`

## 預防措施

1. **在 watch 回調中使用 stop 時，總是檢查變數是否存在**
2. **考慮是否真的需要 `immediate: true`**
3. **在複雜的異步邏輯中，使用更安全的變數宣告方式**

## 測試建議

在修改後，建議測試以下場景：
- 組件首次載入
- 路由切換
- 數據更新
- 組件銷毀

確保在所有情況下都不會出現變數作用域錯誤。 