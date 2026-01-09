<script setup>
  import { ref, onMounted } from 'vue'
  import { useToast } from 'vue-toastification'
  import AppTable from '@/components/Table/AppTable.vue'
  import DataRowAppTable from '@/components/Table/DataRowAppTable.vue'
  import AppLinkButton from '@/components/AppLinkButton.vue'
  import PopUp from '@/components/PopUp.vue'
  import AppToastNotification from '@/components/AppToastNotification.vue'
  import AddEmployeeForm from './AddEmployeeForm.vue'
  import UpdateEmployeeForm from './UpdateEmployeeForm.vue'
  import EmployeesRepository from '@/repositories/EmployeesRepository'
  import DeleteEmployeePage from './DeleteEmployeePage.vue'

  defineOptions({ name: 'EmployeesIndex' })

  const toast = useToast()

  const headers = ['Nombre', 'Apellido', 'Correo electrónico', 'Teléfono', 'Acciones']
  const items = ref([])

  const selectedEmployeeId = ref(null)

  const addEmployeeFormVisible = ref(false)
  const updateEmployeeFormVisible = ref(false)
  const deleteEmployeePageVisible = ref(false)

  async function loadEmployees() {
    try {
      const data = await EmployeesRepository.getActiveEmployees()
      items.value = data
    } catch (error) {
      const errorMsg = error.response?.data || "Estamos presentando fallas en el sistema. Por favor vuelva más tarde."
      toast.error(errorMsg)
    }
  }

  onMounted(() => {
    loadEmployees()
  })

  function handleAddSuccess() {
    loadEmployees()
    addEmployeeFormVisible.value = false 
    toast.success("El empleado se ha registrado correctamente.")
  }

  function handleUpdateSuccess() {
    loadEmployees()
    selectedEmployeeId.value = null
    updateEmployeeFormVisible.value = false 
    toast.success("Los datos del empleado se han actualizado correctamente.")
  }

  function handleDeleteSuccess(){
    loadEmployees()
    selectedEmployeeId.value = null
    deleteEmployeePageVisible.value = false
    toast.success("El empleado se ha eliminado correctamente.")
  }

  function showAddEmployeeForm() {
    addEmployeeFormVisible.value = true;
  }

  function showUpdateEmployeeForm(id) {
    selectedEmployeeId.value = id
    updateEmployeeFormVisible.value = true;
  }

  function showDeleteEmployeePage(id){
    selectedEmployeeId.value = id
    deleteEmployeePageVisible.value = true
  }

  function closeAddEmployeeForm() {
    addEmployeeFormVisible.value = false;
  }

  function closeUpdateEmployeeForm() {
    updateEmployeeFormVisible.value = false;
  }

  function closeDeleteEmployeePage(){
    deleteEmployeePageVisible.value = false
  }
</script>

<template>
  <AppToastNotification 
    v-model="toast.show" 
    :message="toast.message" 
    :type="toast.type" 
  />

  <AppTable
    title="Empleados"
    description="Todos los empleados registrados en el sistema."
    :headers="headers"
    :onAdd="showAddEmployeeForm"
  >

    <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 transition-colors duration-150">
      <DataRowAppTable :field="item.name"/>
      <DataRowAppTable :field="item.lastName"/>
      <DataRowAppTable :field="item.email"/>
      <DataRowAppTable :field="item.phone"/>
      <DataRowAppTable class="text-sm font-medium">
        <AppLinkButton
          description="Editar"
          :onClick="() => showUpdateEmployeeForm(item.id)"
        />
        <AppLinkButton
          description="Eliminar"
          :onClick="() => showDeleteEmployeePage(item.id)"
        />
      </DataRowAppTable>
    </tr>
  </AppTable>

  <PopUp v-if="addEmployeeFormVisible" :onClosed="closeAddEmployeeForm">
    <AddEmployeeForm
      @registered="handleAddSuccess"
    />
  </PopUp>

  <PopUp v-if="updateEmployeeFormVisible" :onClosed="closeUpdateEmployeeForm">
    <UpdateEmployeeForm
      :employeeId="selectedEmployeeId"
      @updated="handleUpdateSuccess"
    />
  </PopUp>

  <PopUp v-if="deleteEmployeePageVisible" :onClosed="closeDeleteEmployeePage">
    <DeleteEmployeePage
      :employeeId="selectedEmployeeId"
      @deleted="handleDeleteSuccess"
    />
  </PopUp>
</template>