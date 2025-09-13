<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <p>Total Ratings: {{ ratingStore.ratings.length }}</p>
    <p>Average Score: {{ ratingStore.average }}</p>
  </div>
</template>

<script setup>
import { useRatingStore } from "../store/rating";
const ratingStore = useRatingStore();
</script>
