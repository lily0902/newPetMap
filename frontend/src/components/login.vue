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
        <div class="form-container ">
            <p class="title">Login</p>
            <!-- 表單 -->
            <form class="form" @submit.prevent="login">
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="text" name="email" id="email" placeholder="帳號" v-model="email">
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="密碼" v-model="password">
                    <span class="wrong" style="height:21px;">{{ errMsg }}</span>
                    <div class="forgot">
                        <a  href="#" @click.prevent="router.push('/forgotPassword')">Forgot Password ?</a>
                    </div>
                </div>
                <button class="sign" type="submit">Sign in</button>
            </form>
            <!-- 表單結束 -->

            <!-- 註冊 -->
            <p class="signup mt-5">Don't have an account?
                <a  href="#" class="" @click.prevent="router.push('/signUp')">Sign up</a>
            </p>
        </div>
    </div>
  
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter();
const email = ref('') // 使用 email
const password = ref('') // 使用 password
const errMsg = ref('')

const login = async () => {
  errMsg.value = ''
  try {
    const res = await axios.post('http://localhost:3000/api/login', {
      email: email.value,
      password: password.value
    })
    // 這裡可根據需求處理登入成功，例如儲存 token 或跳轉
    errMsg.value = '登入成功'
  } catch (err) {
    errMsg.value = err.response?.data?.message || '登入失敗'
  }
}
</script>
