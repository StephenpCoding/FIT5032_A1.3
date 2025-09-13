<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">
      Welcome, {{ auth.currentUser?.username }}
    </h1>
    <p>Rate our service (1-5):</p>
    <input
      v-model.number="score"
      type="number"
      min="1"
      max="5"
      class="border p-2 mr-2"
    />
    <button @click="submitRating" class="bg-purple-500 text-white px-4 py-2">
      Submit
    </button>
    <p class="mt-4">Average rating: {{ ratingStore.average }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRatingStore } from "../store/rating";
import { useAuthStore } from "../store/auth";

const score = ref(0);
const ratingStore = useRatingStore();
const auth = useAuthStore();

function submitRating() {
  ratingStore.addRating(score.value);
  score.value = 0;
}
</script>
