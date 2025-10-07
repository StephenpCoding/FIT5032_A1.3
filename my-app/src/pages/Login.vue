<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Login</h1>

    <!-- 输入邮箱 -->
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="border p-2 mb-2 w-64"
    />

    <!-- 输入密码 -->
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="border p-2 mb-2 w-64"
    />

    <!-- 登录按钮 -->
    <button
      @click="handleLogin"
      class="bg-blue-500 text-white px-4 py-2 w-64 hover:bg-blue-600"
    >
      Login
    </button>

    <!-- 跳转到注册页 -->
    <p class="mt-2">
      No account?
      <router-link to="/register" class="text-blue-600 hover:underline">
        Register
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase"; // ✅ 连接 Firebase
import { signInWithEmailAndPassword } from "firebase/auth"; // ✅ Firebase 登录函数

// 路由实例
const router = useRouter();

// 输入框数据
const email = ref("");
const password = ref("");

// 登录函数
async function handleLogin() {
  try {
    // 使用 Firebase 登录
    await signInWithEmailAndPassword(auth, email.value, password.value);
    alert("✅ Login successful!");
    router.push("/home"); // 登录成功后跳转
  } catch (error) {
    alert("❌ Login failed: " + error.message);
  }
}
</script>

<style scoped>
/* 可选：简单的页面居中和样式 */
input {
  border-radius: 4px;
}
button {
  border-radius: 4px;
}
</style>
