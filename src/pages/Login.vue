<script setup>
  import { useSessionStore } from '@/stores/session';
  import router from '@/router'
  import { useToast } from 'vue-toastification';
  import AppButton from '@/components/AppButton.vue';

  const session = useSessionStore()

  function logIn() {
    session.$patch({
      isLoggedIn: true
    })

    router.push({ path: '/pos'})
  }

  const toast = useToast()
  function showToastMessage() {
    toast.success('Hola desde Vue')
  }
</script>

<template>
  <h1 class="h-15">Bienvenido</h1>

  <div class="w-full h-20 items-center">
    <AppButton text="Aqui va el inicio se sesión" :on-click="logIn" color-class="bg-indigo-600 hover:bg-indigo-700 text-white"/>
  </div>

  <div class="w-full h-20 items-center">
    <AppButton text="Ejemplo de Toast Message" :on-click="showToastMessage" color-class="bg-indigo-600 hover:bg-indigo-700 text-white"/>
  </div>

</template>
