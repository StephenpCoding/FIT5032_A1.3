<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Register</h1>
    <input v-model="username" placeholder="Username" class="border p-2 mb-2" />
    <input
      v-model="password"
      type="password"
      placeholder="Password (min 6 chars)"
      class="border p-2 mb-2"
    />
    <button @click="handleRegister" class="bg-green-500 text-white px-4 py-2">
      Register
    </button>
    <p class="mt-2">
      Already have an account?
      <router-link to="/" class="text-blue-600">Login</router-link>
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

function handleRegister() {
  if (auth.register(username.value, password.value)) {
    alert("Registered successfully!");
    router.push("/");
  } else {
    alert("Registration failed: username required, password >= 6 chars");
  }
}
</script>
