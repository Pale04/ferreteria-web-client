<script setup>
  import AppTable from '@/components/AppTable.vue';
  import DataRowAppTable from '@/components/DataRowAppTable.vue';
  import AppLinkButton from '@/components/AppLinkButton.vue';
  import { reactive } from 'vue';

  const headers = reactive([
    'RFC',
    'Nombre',
    'Dirección fiscal',
    'Teléfono'
  ])

  const items = reactive([
    {
      rfc: 'ABC123456A00',
      nombre: 'Truper',
      direccion: 'Av. Xalapa S/N',
      telefono: '2231456756'
    },
    {
      rfc: 'ABC123456A00',
      nombre: 'Truper',
      direccion: 'Av. Xalapa S/N',
      telefono: '2231456756'
    },
  ])

  function showAddProviderForm() {
    console.log('Add')
  }

  function showProviderUpdateForm() {
    console.log('Update')
  }
</script>

<template>
  <AppTable
    title="Proveedores"
    description="Todos los proveedores registrados en el sistema"
    :headers="headers"
    :onAdd="showAddProviderForm"
    >

    <tr v-for="item in items" v-bind:key="item.rfc" class="hover:bg-gray-50 transition-colors duration-150">
      <DataRowAppTable :field="item.rfc" class="font-medium"/>
      <DataRowAppTable :field="item.nombre"/>
      <DataRowAppTable :field="item.direccion"/>
      <DataRowAppTable :field="item.telefono"/>
      <DataRowAppTable class="text-right text-sm font-medium">
        <AppLinkButton description="Edit" :onClick="showProviderUpdateForm"/>
      </DataRowAppTable>
    </tr>

  </AppTable>
</template>
