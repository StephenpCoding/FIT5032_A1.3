import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Home from "../pages/Home.vue";
import Admin from "../pages/Admin.vue";
import { auth } from "../firebase"; // ✅ 从 firebase.js 导入
import { onAuthStateChanged } from "firebase/auth"; // ✅ 检测登录状态

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/home", component: Home, meta: { requiresAuth: true } },
  { path: "/admin", component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ 路由守卫：检查 Firebase 登录状态
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  // 使用 Firebase 检查是否登录
  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      alert("Please login first!");
      next("/");
    } else if (requiresAdmin && user?.email !== "admin@example.com") {
      // ⚙️ 这里假设 admin 的邮箱是 admin@example.com，可自行修改
      alert("Access denied: Admins only!");
      next("/home");
    } else {
      next();
    }
  });
});

export default router;
