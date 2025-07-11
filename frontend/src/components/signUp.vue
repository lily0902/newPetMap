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

  .success-message {
    color: #10b981;
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
            <p class="title">Sign Up</p>
            <form class="form" @submit.prevent="handleRegister">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input 
                        type="text" 
                        name="username" 
                        id="username" 
                        placeholder="請輸入您的用戶名"
                        v-model="username"
                        :disabled="isLoading"
                        required
                    >
                </div>
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
                </div>
                <div class="input-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword" 
                        placeholder="請再次輸入密碼"
                        v-model="confirmPassword"
                        :disabled="isLoading"
                        required
                    >
                </div>
                
                <!-- 錯誤訊息 -->
                <div class="error-message">{{ errorMessage }}</div>
                
                <!-- 成功訊息 -->
                <div class="success-message">{{ successMessage }}</div>
                
                <button 
                    class="sign" 
                    type="submit"
                    :disabled="isLoading"
                >
                    {{ isLoading ? '註冊中...' : 'Sign up' }}
                </button>
            </form>
            
            <p class="signup mt-5">Already have an account?
                <a href="#" @click.prevent="router.push('/login')">Log in</a>
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
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

// 載入狀態
const isLoading = computed(() => authStore.isLoading);

// 處理註冊
const handleRegister = async () => {
  // 清除之前的訊息
  errorMessage.value = '';
  successMessage.value = '';
  
  // 基本驗證
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = '請填寫所有欄位';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '密碼確認不一致';
    return;
  }
  
  if (password.value.length < 6) {
    errorMessage.value = '密碼至少需要 6 個字元';
    return;
  }
  
  // 呼叫 auth store 的註冊方法
  const result = await authStore.register(username.value, email.value, password.value);
  
  if (result.success) {
    // 註冊成功
    successMessage.value = result.message;
    
    // 清空表單
    username.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    
    // 3 秒後跳轉到登入頁
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } else {
    // 註冊失敗，顯示錯誤訊息
    errorMessage.value = result.message;
  }
};
</script>
