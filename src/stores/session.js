import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore('session', () => {
  const isLoggedIn = ref(false)
  const isAdmin = ref(false)
  const user = ref(null)
  const token = ref(null)

  function setSession(userData) {
    isLoggedIn.value = true
    token.value = userData.token
    user.value = {
        id: userData.id,
        name: userData.name,
        email: userData.email
    }
    isAdmin.value = userData.role === 'Admin'
    localStorage.setItem('user_token', userData.token)
  }

  function logout() {
    isLoggedIn.value = false
    token.value = null
    user.value = null
    isAdmin.value = false
    localStorage.removeItem('user_token')
  }

  return {
    isLoggedIn,
    isAdmin,
    user,
    token,
    setSession,
    logout
  }
})