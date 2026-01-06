<script setup>
  import AppTable from '@/components/Table/AppTable.vue';
  import DataRowAppTable from '@/components/Table/DataRowAppTable.vue';
  import EditProviderButton from './EditProviderButton.vue';
  import PopUp from '@/components/PopUp.vue';
  import Form from './Form.vue';
  import { onMounted, reactive, ref } from 'vue';
  import { addProvider, getAllProviders, updateProvider, updateProviderState } from '@/repositories/ProvidersRepository';
  import { useToast } from 'vue-toastification';

  const toast = useToast();

  const headers = reactive([
    'RFC',
    'Nombre',
    'Teléfono',
    'Correo',
    'Estado',
    'Acciones'
  ])

  const providers = reactive([])

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
      const providerIndex = providers.findIndex((p) => p.id === provider.id)
      providers[providerIndex] = provider
      toast.info('Los datos han sido actualizados correctamente')
    } else {
      toast.warning(response.msg ?? 'Ocurrió algo inesperado. Intente de nuevo más tarde')
    }
  }

  function closeUpdateProviderForm() {
    updateProviderFormVisible.value = false
  }

  async function changeProviderState(id) {
    const response = await updateProviderState(id)

    if(response.success) {
      var provider = providers.find((p) => p.id === id)
      provider.active = !provider.active
      toast.info('El estado del proveedor se ha actualizado')
    } else {
      toast.warning(response.msg ?? 'Ocurrió algo inesperado. Intente de nuevo más tarde')
    }
  }

  onMounted(async () => {
    const response = await getAllProviders();

    if(response.success) {
      if (response.data.length === 0) {

      } else {
        for (let i = 0; i < response.data.length; i++) {
          providers.push(response.data[i])
        }
      }
    } else {
      toast.warning(response.msg)
    }
  })
</script>

<template>
  <AppTable
    title="Proveedores"
    description="Todos los proveedores registrados"
    :headers="headers"
    :onAdd="showAddProviderForm"
    >

    <tr v-for="item in providers" v-bind:key="item.id" class="hover:bg-gray-50 transition-colors duration-150">
      <DataRowAppTable :field="item.rfc" class="font-medium"/>
      <DataRowAppTable :field="item.name"/>
      <DataRowAppTable :field="item.phone"/>
      <DataRowAppTable :field="item.email"/>
      <DataRowAppTable :field="item.active ? 'Activo' : 'Desactivado'"/>
      <DataRowAppTable class="text-sm font-medium" @clicked="showUpdateProviderForm">
        <EditProviderButton text="Editar" :id="item.id" @clicked="showUpdateProviderForm"/>
        <span class="p-5"></span>
        <EditProviderButton :text="item.active ? 'Desactivar' : 'Activar'" :id="item.id" @clicked="changeProviderState"/>
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
