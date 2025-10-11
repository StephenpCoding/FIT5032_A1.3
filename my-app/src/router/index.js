import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Home from "../pages/Home.vue";
import Admin from "../pages/Admin.vue";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import SendEmail from "../pages/SendEmail.vue";
import Activity from "../pages/Activity.vue";
import MapView from "../pages/MapView.vue";
import BookingCalendar from "../pages/BookingCalendar.vue";
import Chart from "../pages/Chart.vue";

// ✅ 定义路由表
const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/admin", component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: "/send-email", component: SendEmail, meta: { requiresAuth: true } },
  { path: "/activity", component: Activity, meta: { requiresAuth: true } },
  { path: "/map", component: MapView, meta: { requiresAuth: true } },
  { path: "/booking", component: BookingCalendar, meta: { requiresAuth: true } },
  { path: "/chart", component: Chart, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ 缓存当前登录用户
let currentUser = null;

// ✅ 初始化时注册一次 Firebase 登录状态监听
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

// ✅ 全局路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  // ⚠️ 未登录访问受保护路由时重定向到登录页
  if (requiresAuth && !currentUser) {
    alert("Please login first!");
    next("/");
    return;
  }

  // ⚠️ 管理员访问控制
  if (requiresAdmin && currentUser?.email !== "cszc0906@163.com") {
    alert("Access denied: Admins only!");
    next("/home");
    return;
  }

  // ✅ 放行
  next();
});

export default router;
