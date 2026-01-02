<script setup>
import { ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppPopUp from '@/components/AppPopUp.vue'
import AppToastNotification from '@/components/AppToastNotification.vue'
import EmployeesRepository from '@/repositories/EmployeesRepository'

defineOptions({ name: 'EmployeesIndex' })

const showModal = ref(false)
const isLoading = ref(false)

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const initialState = {
  name: '', lastName: '', secondLastName: '',
  email: '', phone: '', birthDate: '',
  gender: '', city: '', address: '',
  postalCode: '', password: '', confirmPassword: ''
}

const newEmployee = ref({ ...initialState })

function showNotification(msg, type = 'success') {
  toast.value.message = msg
  toast.value.type = type
  toast.value.show = true
  setTimeout(() => toast.value.show = false, 5000)
}

function resetForm() {
  newEmployee.value = { ...initialState }
}

function validatePhone(event) {
  newEmployee.value.phone = event.target.value.replace(/\D/g, '');
}

async function saveEmployee() {
  if (newEmployee.value.password !== newEmployee.value.confirmPassword) {
    showNotification("Las contraseñas no coinciden", "error")
    return
  }

  try {
    isLoading.value = true
    await EmployeesRepository.register(newEmployee.value)
    
    showNotification("El empleado se ha registrado correctamente", "success")
    resetForm()
    showModal.value = false
    
  } catch (error) {
    const errorMsg = error.response?.data || "Ocurrió un error inesperado. Por favor intente más tarde."
    showNotification(errorMsg, "error")
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="employees-page">
    <AppToastNotification 
      v-model="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
    />

    <header class="header">
      <h1>GESTIÓN DE EMPLEADOS</h1>
      <AppButton @click="showModal = true">Registrar nuevo empleado</AppButton>
    </header>

    <AppPopUp v-if="showModal" @close="showModal = false">
      <template #header> Registrar nuevo empleado </template>
      
      <form @submit.prevent="saveEmployee" class="form-grid">
        <input v-model="newEmployee.name" maxlength="50" placeholder="Nombre(s)" required />
        <input v-model="newEmployee.lastName" maxlength="50" placeholder="Apellido paterno" required />
        <input v-model="newEmployee.secondLastName" maxlength="50" placeholder="Apellido materno (opcional)" />
        <input v-model="newEmployee.email" type="email" maxlength="254" placeholder="Correo electrónico" required />
        <input type="text" v-model="newEmployee.phone" maxlength="10" @input="validatePhone" placeholder="Teléfono" required />
        <input v-model="newEmployee.birthDate" type="date" required />
        
        <select v-model="newEmployee.gender" required>
          <option value="">Seleccionar género:</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
        </select>

        <input v-model="newEmployee.city" maxlength="100" placeholder="Ciudad" required />
        <input v-model="newEmployee.address" maxlength="255" placeholder="Dirección" required />
        <input v-model="newEmployee.postalCode" maxlength="5" placeholder="Código postal" required />
        <input v-model="newEmployee.password" maxlength="60" type="password" placeholder="Contraseña" required minlength="8" />
        <input v-model="newEmployee.confirmPassword" maxlength="60" type="password" placeholder="Confirmar contraseña" required minlength="8" />

        <div class="actions">
          <AppButton type="submit" :disabled="isLoading">
            {{ isLoading ? 'Registrando...' : 'Registrar' }}
          </AppButton>
          <button type="button" class="btn-cancel" @click="showModal = false">Cancelar</button>
        </div>
      </form>
    </AppPopUp>
  </div>
</template>

<style scoped>
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.actions { grid-column: span 2; display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
input, select { padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; }
.btn-cancel { background: #eee; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; }
</style>