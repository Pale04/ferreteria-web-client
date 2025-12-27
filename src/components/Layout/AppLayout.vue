<script setup>
  import { useSessionStore } from '@/stores/session';
  import router from '@/router'
  import HeaderAppLayout from '@/components/Layout/HeaderAppLayout.vue'
  import UserInfoAppLayout from '@/components/Layout/UserInfoAppLayout.vue';
  import TabAppLayout from '@/components/Layout/TabAppLayout.vue';
  import AppButton from '@/components/AppButton.vue';

  const session = useSessionStore()

  function logOut() {
    session.$patch({
      isLoggedIn: false
    })

    router.push({ path: '/login', replace: true})
  }
</script>

<template>
  <div class="fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-xl z-50">

    <HeaderAppLayout/>
    <UserInfoAppLayout/>

    <nav class="mt-8 px-4">
      <div class="space-y-2">
        <TabAppLayout title="Punto de venta" route="/pos" icon-class="pi pi-shopping-cart"/>
        <TabAppLayout title="Proveedores" route="/providers" icon-class="pi pi-file-check"/>
        <TabAppLayout title="Inventario" route="/stock" icon-class="pi pi-warehouse"/>
        <TabAppLayout title="Usuarios" route="/users" icon-class="pi pi-user"/>
      </div>
    </nav>

    <div class="absolute bottom-4 px-4">
      <AppButton text="Cerrar sesión" :on-click="logOut" icon-class="pi pi-sign-out" color-class="bg-red-600 hover:bg-red-700 text-white"/>
    </div>

  </div>


  <div class="ml-64">

    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Titulo</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="p-6">
      <router-view/>
    </main>
  </div>

</template>
