<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Register</h1>

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
      placeholder="Password (min 6 chars)"
      class="border p-2 mb-2 w-64"
    />

    <!-- 注册按钮 -->
    <button
      @click="handleRegister"
      class="bg-green-500 text-white px-4 py-2 w-64 hover:bg-green-600"
    >
      Register
    </button>

    <p class="mt-2">
      Already have an account?
      <router-link to="/" class="text-blue-600 hover:underline">Login</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase"; // ✅ 导入 Firebase 实例
import { createUserWithEmailAndPassword } from "firebase/auth"; // ✅ 导入注册函数

const router = useRouter();
const email = ref(""); // ✅ 改为 email 而不是 username
const password = ref("");

// 注册逻辑
async function handleRegister() {
  try {
    // 使用 Firebase Auth 创建账户
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    alert("✅ Registered successfully!");
    router.push("/"); // 注册后跳回登录页
  } catch (error) {
    alert("❌ Registration failed: " + error.message);
  }
}
</script>

<style scoped>
input {
  border-radius: 4px;
}
button {
  border-radius: 4px;
}
</style>
