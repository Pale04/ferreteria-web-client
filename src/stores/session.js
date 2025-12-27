import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore('session', () => {
  const isLoggedIn = ref(false)
  const isAdmin = ref(false)
  const username = ref('Default')

  function getRol() {
    return isAdmin.value ? 'Administrador' : 'Empleado General'
  }

  return {
    isLoggedIn,
    isAdmin,
    username,
    getRol
  }
})
