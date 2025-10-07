<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">
      Welcome, <span class="text-blue-600">{{ userEmail }}</span>
    </h1>

    <!-- 打分部分 -->
    <p class="mb-2">Rate our service (1-5):</p>
    <div class="flex items-center mb-4">
      <input
        v-model.number="score"
        type="number"
        min="1"
        max="5"
        class="border p-2 mr-2 w-20"
      />
      <button
        @click="submitRating"
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Submit
      </button>
    </div>

    <p class="text-gray-700">Average rating: {{ ratingStore.average }}</p>

    <!-- 登出按钮 -->
    <button
      @click="logout"
      class="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRatingStore } from "../store/rating";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const router = useRouter();
const ratingStore = useRatingStore();
const score = ref(0);
const userEmail = ref("");

// 获取当前用户信息
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.value = user.email;
    } else {
      router.push("/"); // 未登录跳回登录页
    }
  });
});

// 提交评分
function submitRating() {
  if (score.value < 1 || score.value > 5) {
    alert("Please enter a rating between 1 and 5.");
    return;
  }
  ratingStore.addRating(score.value);
  score.value = 0;
}

// 登出
async function logout() {
  await signOut(auth);
  alert("You have logged out.");
  router.push("/");
}
</script>
