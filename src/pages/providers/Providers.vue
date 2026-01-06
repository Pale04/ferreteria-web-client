<script setup>
  import AppTable from '@/components/Table/AppTable.vue';
  import DataRowAppTable from '@/components/Table/DataRowAppTable.vue';
  import EditProviderButton from './EditProviderButton.vue';
  import PopUp from '@/components/PopUp.vue';
  import Form from './Form.vue';
  import { reactive, ref } from 'vue';
  import { addProvider, updateProvider } from '@/repositories/ProvidersRepository';
  import { useToast } from 'vue-toastification';

  const toast = useToast();

  const headers = reactive([
    'RFC',
    'Nombre',
    'Teléfono',
    'Correo',
    'Dirección Fiscal',
    'Estado',
    'Acciones'
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
  const updateProviderFormVisible = ref(false)
  const providerBeeingUpdated = ref(0)

  function showAddProviderForm() {
    addProviderFormVisible.value = true;
  }

  async function sendAddProviderForm(provider) {
    const response = await addProvider(provider)

    if (response.success) {
      toast.info(response.msg)
    } else {
      toast.warning(response.msg)
    }
  }

  function closeAddProviderForm() {
    addProviderFormVisible.value = false
  }

  function showUpdateProviderForm(id) {
    updateProviderFormVisible.value = true
    providerBeeingUpdated.value = id
  }

  async function sendUpdateProviderForm(provider) {
    const response = await updateProvider(provider)

    if(response.success) {
      toast.info('Los datos han sido actualizados correctamente')
    } else {
      toast.warning(response.msg)
    }
  }

  function closeUpdateProviderForm() {
    updateProviderFormVisible.value = false
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
      <DataRowAppTable :field="item.active ? 'Activo' : 'Desactivado'"/>
      <DataRowAppTable class="text-sm font-medium" @clicked="showUpdateProviderForm">
        <EditProviderButton text="Editar" :id="item.id" @clicked="showUpdateProviderForm"/>
        <EditProviderButton :text="item.active ? 'Desactivar' : 'Activar'" :id="item.id" @clicked="showUpdateProviderForm"/>
      </DataRowAppTable>
    </tr>
  </AppTable>

  <PopUp v-if="addProviderFormVisible" :onClosed="closeAddProviderForm">
    <Form
      :on-form-sent="sendAddProviderForm"
      sendButtonText="Registrar"
      title="Agregar nuevo Proveedor"/>
  </PopUp>

  <PopUp v-if="updateProviderFormVisible" :onClosed="closeUpdateProviderForm">
    <Form
      :on-form-sent="sendUpdateProviderForm"
      sendButtonText="Guardar cambios"
      title="Editar datos de Proveedor"
      :providerId="providerBeeingUpdated"/>
  </PopUp>
</template>
