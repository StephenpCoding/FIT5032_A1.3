import { defineStore } from 'pinia'

export const useRatingStore = defineStore('rating', {
  state: () => ({ ratings: [] }),
  getters: {
    average: (state) =>
      state.ratings.length
        ? (state.ratings.reduce((a, b) => a + b, 0) / state.ratings.length).toFixed(2)
        : 0
  },
  actions: {
    addRating(score) {
      if (score >= 1 && score <= 5) this.ratings.push(score)
    }
  }
})
