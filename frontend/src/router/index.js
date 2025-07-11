import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue'),
    meta: { requiresAuth: false } // 不需要登入就能訪問
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/login.vue'),
    meta: { requiresGuest: true } // 只有未登入用戶才能訪問
  },
  {
    path: '/forgotPassword',
    name: 'ForgotPassword',
    component: () => import('../components/forgotPassword.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: () => import('../components/signUp.vue'),
    meta: { requiresGuest: true }
  },
  // 404 頁面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 初始化認證狀態
  await authStore.initAuth();
  
  // 檢查是否需要登入
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 需要登入但未登入，重定向到登入頁
    next('/login');
    return;
  }
  
  // 檢查是否只允許未登入用戶訪問
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // 已登入用戶訪問登入/註冊頁，重定向到首頁
    next('/');
    return;
  }
  
  next();
});

export default router; 