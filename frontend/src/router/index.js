import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/login.vue')
  },
  {
    path: '/forgotPassword',
    name: 'ForgotPassword',
    component: () => import('../components/forgotPassword.vue')
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: () => import('../components/signUp.vue')
  },
  // 你可以在這裡加其他路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 