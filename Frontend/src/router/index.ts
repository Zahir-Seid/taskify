import { createRouter, createWebHistory } from 'vue-router'
import login from '@/pages/signin.vue'
import register from '@/pages/signup.vue'
import dashboard from '@/pages/task/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: dashboard,
    },
    {
      path: '/login',
      name: 'signin',
      component: login
    },
    {
      path: '/register',
      name: 'signup',
      component: register
    }
  ],
})


export default router
