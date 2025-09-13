import { defineStore } from 'pinia'

function sanitizeInput(input) {
  const div = document.createElement("div")
  div.innerText = input
  return div.innerHTML
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: [{ username: 'admin', password: '123456', role: 'admin' }],
    currentUser: null
  }),
  actions: {
    register(username, password) {
      if (!username || password.length < 6) return false
      const safeUsername = sanitizeInput(username)
      this.users.push({ username: safeUsername, password, role: 'user' })
      return true
    },
    login(username, password) {
      const user = this.users.find(u => u.username === username && u.password === password)
      if (user) this.currentUser = user
      return user
    },
    logout() {
      this.currentUser = null
    }
  }
})
