import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore('session', () => {
  const isLoggedIn = ref(false)
  const isAdmin = ref(false)
  const username = ref('')

  return {
    isLoggedIn,
    isAdmin,
    username
  }
})
