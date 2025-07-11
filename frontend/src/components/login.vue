<style scoped>
  .form-container {
    width: 320px;
    border-radius: 0.75rem;
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: #2A2B38;
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
  }

  .input-group input:focus {
    border-color: rgba(167, 139, 250);
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    min-height: 1.25rem;
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175,1);
    margin: 8px 0 14px 0;
  }

  .forgot a,.signup a {
    color: rgba(243, 244, 246, 1);
    text-decoration: none;
    font-size: 14px;
  }

  .forgot a:hover, .signup a:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
  }

  .sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .sign:hover:not(:disabled) {
    background-color: rgba(147, 119, 230, 1);
  }

  .sign:disabled {
    background-color: rgba(107, 114, 128, 1);
    cursor: not-allowed;
  }

  .social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
  }

  .line {
    height: 1px;
    flex: 1 1 0%;
    background-color: rgba(55, 65, 81, 1);
  }

  .social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(156, 163, 175, 1);
  }

  .social-icons {
    display: flex;
    justify-content: center;
  }

  .social-icons .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    background-color: transparent;
    margin-left: 8px;
  }

  .social-icons .icon svg {
    height: 1.25rem;
    width: 1.25rem;
    fill: #fff;
  }

  .signup {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
  }
</style>

<template>
    <div class="flex flex-col items-center justify-center content-center min-h-screen bg-indigo-950">
        <div class="form-container">
            <p class="title">Login</p>
            <!-- 表單 -->
            <form class="form" @submit.prevent="handleLogin">
                <div class="input-group">
                    <label for="email">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="請輸入您的 Email" 
                        v-model="email"
                        :disabled="isLoading"
                        required
                    >
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="請輸入您的密碼" 
                        v-model="password"
                        :disabled="isLoading"
                        required
                    >
                    <div class="error-message">{{ errorMessage }}</div>
                    <div class="forgot">
                        <a href="#" @click.prevent="router.push('/forgotPassword')">Forgot Password ?</a>
                    </div>
                </div>
                <button 
                    class="sign" 
                    type="submit"
                    :disabled="isLoading"
                >
                    {{ isLoading ? '登入中...' : 'Sign in' }}
                </button>
            </form>
            <!-- 表單結束 -->

            <!-- 註冊 -->
            <p class="signup mt-5">Don't have an account?
                <a href="#" @click.prevent="router.push('/signUp')">Sign up</a>
            </p>
        </div>
    </div>
  
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// 表單資料
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// 載入狀態
const isLoading = computed(() => authStore.isLoading);

// 處理登入
const handleLogin = async () => {
  // 清除之前的錯誤訊息
  errorMessage.value = '';
  
  // 基本驗證
  if (!email.value || !password.value) {
    errorMessage.value = '請輸入 Email 和密碼';
    return;
  }
  
  // 呼叫 auth store 的登入方法
  const result = await authStore.login(email.value, password.value);
  
  if (result.success) {
    // 登入成功，延遲跳轉給地圖載入時間
    setTimeout(() => {
      router.push('/');
    }, 500); // 延遲 0.5 秒跳轉
  } else {
    // 登入失敗，顯示錯誤訊息
    errorMessage.value = result.message;
  }
};
</script>
