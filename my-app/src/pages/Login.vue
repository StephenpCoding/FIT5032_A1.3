<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Login</h1>
    <input v-model="username" placeholder="Username" class="border p-2 mb-2" />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="border p-2 mb-2"
    />
    <button @click="handleLogin" class="bg-blue-500 text-white px-4 py-2">
      Login
    </button>
    <p class="mt-2">
      No account?
      <router-link to="/register" class="text-blue-600">Register</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const username = ref("");
const password = ref("");

function handleLogin() {
  if (auth.login(username.value, password.value)) {
    router.push("/home");
  } else {
    alert("Invalid credentials");
  }
}
</script>
