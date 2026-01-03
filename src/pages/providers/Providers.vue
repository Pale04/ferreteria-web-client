<script setup>
  import AppTable from '@/components/Table/AppTable.vue';
  import DataRowAppTable from '@/components/Table/DataRowAppTable.vue';
  import AppLinkButton from '@/components/AppLinkButton.vue';
  import PopUp from '@/components/PopUp.vue';
  import AddProviderForm from '@/pages/providers/AddProviderForm.vue';
  import { reactive, ref } from 'vue';

  const headers = reactive([
    'RFC',
    'Nombre',
    'Teléfono',
    'Correo',
    'Dirección Fiscal',
    'Activado'
  ])

  const items = reactive([
    {
      id: 1,
      rfc: 'ABC123456A00',
      name: 'Truper',
      phone: '2231456756',
      email: 'truper@gmail.com',
      address: 'Av. Xalapa S/N',
      active: true
    },
    {
      id: 2,
      rfc: 'ABC123456A00',
      name: 'Truper',
      phone: '2231456756',
      email: 'truper@gmail.com',
      address: 'Av. Xalapa S/N',
      active: true
    },
  ])

  const addProviderFormVisible = ref(false)

  function showAddProviderForm() {
    addProviderFormVisible.value = true;
  }

  function closeAddProviderForm() {
    addProviderFormVisible.value = false;
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

    <tr v-for="item in items" v-bind:key="item.id" class="hover:bg-gray-50 transition-colors duration-150">
      <DataRowAppTable :field="item.rfc" class="font-medium"/>
      <DataRowAppTable :field="item.name"/>
      <DataRowAppTable :field="item.phone"/>
      <DataRowAppTable :field="item.email"/>
      <DataRowAppTable :field="item.address"/>
      <DataRowAppTable :field="item.active"/>
      <DataRowAppTable class="text-right text-sm font-medium">
        <AppLinkButton description="Edit" :onClick="showProviderUpdateForm"/>
      </DataRowAppTable>
    </tr>
  </AppTable>

  <PopUp v-if="addProviderFormVisible" :onClosed="closeAddProviderForm">
    <AddProviderForm/>
  </PopUp>
</template>
