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

  .message {
    color: #10b981;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    min-height: 1.25rem;
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

  .back-link {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
    margin-top: 1rem;
  }

  .back-link a {
    color: rgba(243, 244, 246, 1);
    text-decoration: none;
    font-size: 14px;
  }

  .back-link a:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
  }
</style>

<template>
    <div class="flex flex-col items-center justify-center content-center min-h-screen bg-indigo-950">
        <div class="form-container">
            <p class="title">Forgot Password</p>
            <form class="form" @submit.prevent="handleSubmit">
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
                
                <div class="message">{{ message }}</div>
                
                <button 
                    class="sign" 
                    type="submit"
                    :disabled="isLoading"
                >
                    {{ isLoading ? '發送中...' : 'Send Reset Link' }}
                </button>
            </form>
            
            <p class="back-link">
                <a href="#" @click.prevent="router.push('/login')">← Back to Login</a>
            </p>
        </div>
    </div>
  
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

// 表單資料
const email = ref('');
const message = ref('');
const isLoading = ref(false);

// 處理提交
const handleSubmit = async () => {
  if (!email.value) {
    message.value = '請輸入您的 Email';
    return;
  }
  
  isLoading.value = true;
  message.value = '';
  
  try {
    // 這裡可以呼叫後端 API 來發送重設密碼郵件
    // 暫時模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    message.value = '重設密碼連結已發送到您的 Email';
    email.value = '';
  } catch (error) {
    message.value = '發送失敗，請稍後再試';
  } finally {
    isLoading.value = false;
  }
};
</script>
