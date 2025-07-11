import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  // 狀態
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const isLoading = ref(false);

  // 計算屬性
  const isAuthenticated = computed(() => !!token.value);
  const isLoggedIn = computed(() => !!token.value);

  // 設置 axios 預設 headers
  const setAuthHeader = (authToken) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // 初始化時設置 header
  if (token.value) {
    setAuthHeader(token.value);
  }

  // 登入
  const login = async (email, password) => {
    isLoading.value = true;
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });

      const { token: authToken, user: userData } = response.data;
      
      // 儲存 token 和用戶資料
      token.value = authToken;
      user.value = userData;
      
      // 儲存到 localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // 設置 axios header
      setAuthHeader(authToken);
      
      return { success: true };
    } catch (error) {
      console.error('登入失敗:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '登入失敗，請檢查帳號密碼'
      };
    } finally {
      isLoading.value = false;
    }
  };

  // 註冊
  const register = async (username, email, password) => {
    isLoading.value = true;
    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        username,
        email,
        password
      });

      return { success: true, message: '註冊成功！' };
    } catch (error) {
      console.error('註冊失敗:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || '註冊失敗，請稍後再試'
      };
    } finally {
      isLoading.value = false;
    }
  };

  // 登出
  const logout = async () => {
    try {
      // 可選：調用後端登出 API
      if (token.value) {
        await axios.post('http://localhost:3000/api/logout');
      }
    } catch (error) {
      console.error('登出 API 調用失敗:', error);
      // 即使 API 調用失敗，也要清除本地狀態
    } finally {
      // 清除本地狀態
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthHeader(null);
    }
  };

  // 驗證 token
  const verifyToken = async () => {
    if (!token.value) return false;
    
    try {
      const response = await axios.get('http://localhost:3000/api/verify');
      return response.data.valid;
    } catch (error) {
      console.error('Token 驗證失敗:', error);
      logout();
      return false;
    }
  };

  // 初始化認證狀態
  const initAuth = async () => {
    if (token.value) {
      const isValid = await verifyToken();
      if (!isValid) {
        logout();
      }
    }
  };

  return {
    // 狀態
    token,
    user,
    isLoading,
    
    // 計算屬性
    isAuthenticated,
    isLoggedIn,
    
    // 方法
    login,
    register,
    logout,
    verifyToken,
    initAuth
  };
}); 