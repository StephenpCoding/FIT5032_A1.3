import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Home from '../pages/Home.vue'
import Admin from '../pages/Admin.vue'
import { useAuthStore } from '../store/auth'

const routes = [
  { path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { path: '/admin', component: Admin, meta: { requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAdmin && auth.currentUser?.role !== 'admin') {
    next('/home')
  } else if (to.meta.requiresAuth && !auth.currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
