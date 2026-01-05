<script setup>
  import { ref } from 'vue'
  import { useSessionStore } from '@/stores/session'
  import router from '@/router'
  import AuthRepository from '@/repositories/AuthRepository'

  defineOptions({ name: 'LoginPage' })

  const session = useSessionStore()

  const credentials = ref({
    email: '',
    password: ''
  })

  const errorMessage = ref('')
  const isLoading = ref(false)

  async function handleLogin() {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const data = await AuthRepository.login(credentials.value)
      session.setSession(data)

    if(session.isAdmin){
      router.push({ path: '/pos'})
    } else {
      router.push('/stock')
    }
  } catch (error) {
    errorMessage.value = error.response?.data || "Ocurrió un error inesperado. Por favor intente más tarde."
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-screen bg-gradient-to-br from-blue-600 to-cyan-300 flex justify-center items-center w-full">

    <form @submit.prevent="handleLogin">
      <div class="bg-white px-10 py-8 rounded-xl w-screen shadow-xl max-w-sm">
        <div class="space-y-4">
          <h1 class="text-center text-2xl font-semibold text-gray-600">FERRETERÍA WEB</h1>
          <hr>

          <div class="flex items-center border-2 py-2 px-3 rounded-md mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              v-model="credentials.email"
              class="pl-2 outline-none border-none w-full"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div class="flex items-center border-2 py-2 px-3 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            <input
              v-model="credentials.password"
              class="pl-2 outline-none border-none w-full"
              type="password"
              placeholder="Contraseña"
              required
            />
          </div>
        </div>

        <Transition name="fade">
          <p v-if="errorMessage" class="text-red-500 text-xs text-center mt-4 font-semibold italic">
            {{ errorMessage }}
          </p>
        </Transition>

        <button
          type="submit"
          :disabled="isLoading"
          class="mt-6 w-full shadow-xl bg-gradient-to-tr from-blue-600 to-red-400 hover:to-red-700 text-indigo-100 py-2 rounded-md text-lg tracking-wide transition duration-1000 disabled:opacity-50"
        >
          {{ isLoading ? 'Cargando...' : 'INGRESAR' }}
        </button>

        <hr class="mt-4">
        <div class="flex justify-center items-center mt-4">
          <p class="inline-flex items-center text-gray-700 font-medium text-xs text-center">
            <span class="ml-2 font-sans">Sistema de Gestión Interna</span>
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
</style>