<script setup>
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-gray-800 text-white p-4 flex justify-between">
      <div class="font-bold">My App</div>
      <div class="space-x-4">
        <router-link to="/" class="hover:underline">Login</router-link>
        <router-link to="/register" class="hover:underline"
          >Register</router-link
        >
        <router-link to="/home" class="hover:underline">Home</router-link>
        <router-link to="/admin" class="hover:underline">Admin</router-link>
      </div>
    </nav>
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
