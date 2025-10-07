<script setup>
import { ref, onMounted } from "vue";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const user = ref(null);

// ✅ 监听 Firebase 登录状态变化
onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});

// ✅ 登出功能
async function logout() {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to logout");
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- ✅ 顶部导航栏 -->
    <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <!-- 左侧导航 -->
      <div class="flex items-center space-x-4">
        <div class="font-bold text-lg">My App</div>
        <router-link to="/" class="hover:underline">Login</router-link>
        <router-link to="/register" class="hover:underline">Register</router-link>
        <router-link to="/home" class="hover:underline">Home</router-link>
        <router-link to="/admin" class="hover:underline">Admin</router-link>
        <router-link to="/send-email" class="hover:underline">Send Email</router-link>
        <router-link to="/activity" class="hover:underline">Activity</router-link>
      </div>

      <!-- 右侧显示登录状态 -->
      <div v-if="user" class="flex items-center space-x-3">
        <span class="text-gray-300 text-sm">{{ user.email }}</span>
        <button
          @click="logout"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>

    <!-- ✅ 页面主体内容 -->
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
nav a.router-link-exact-active {
  color: #fff;
  font-weight: bold;
  text-decoration: underline;
}
</style>
