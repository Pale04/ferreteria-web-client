<script setup>
    import { ref } from 'vue'
    import AppButton from '@/components/AppButton.vue'
    import AppToastNotification from '@/components/AppToastNotification.vue'
    import EmployeesRepository from '@/repositories/EmployeesRepository'

    const toast = ref({
        show: false,
        message: '',
        type: 'success'
    })
    
    const isLoading = ref(false)

    const initialState = {
        name: '', lastName: '', secondLastName: '',
        email: '', phone: '', birthDate: '',
        gender: '', city: '', address: '',
        postalCode: '', password: '', confirmPassword: ''
    }

    const newEmployee = ref({ ...initialState })

    function showMessage(msg, type = 'success') {
        toast.value.message = msg
        toast.value.type = type
        toast.value.show = true
        setTimeout(() => toast.value.show = false, 5000)
    }

    function validatePhone(event){
        newEmployee.value.phone = event.target.value.replace(/\D/g, '');
    }
    
    function validatePostalCode(event){
        newEmployee.value.postalCode = event.target.value.replace(/\D/g, '');
    }

    function validatePassword(){
        if (newEmployee.value.password != newEmployee.value.confirmPassword){
            showMessage("Las contraseñas no coinciden.", "error")
            return;
        }
    }

    async function sendForm() {
        validatePassword()

        try {
            isLoading.value = true
            await EmployeesRepository.registerEmployee(newEmployee.value)
            showMessage("El empleado se ha registrado correctamente.", "success")
            newEmployee.value = { ...initialState }
            console.log("pendejo")
        } catch (error) {
            const errorMsg = error.response?.data || "Ocurrió un error inesperado. Por favor intente más tarde."
            showMessage(errorMsg, "error")
        } finally {
            isLoading.value = false
        }
    }
</script>

<template>
    <div class="text-center">
        <p class="mb-3 text-2xl font-semibold leading-5 text-slate-900 py-5">
            Agregar nuevo Empleado
        </p>
    </div>

    <AppToastNotification 
      v-model="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
    />

    <form @submit.prevent="sendForm" class="form-grid">
        <input v-model="newEmployee.name" maxlength="50" placeholder="Nombre(s)" required />
        <input v-model="newEmployee.lastName" maxlength="50" placeholder="Apellido paterno" required />
        <input v-model="newEmployee.secondLastName" maxlength="50" placeholder="Apellido materno (opcional)" />
        <input v-model="newEmployee.email" type="email" maxlength="254" placeholder="Correo electrónico" required />
        <input v-model="newEmployee.phone" maxlength="10" @input="validatePhone" placeholder="Teléfono" required />
        <input v-model="newEmployee.birthDate" type="date" required />
    
        <select v-model="newEmployee.gender" required>
            <option value="">Seleccionar género:</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
        </select>

        <input v-model="newEmployee.city" maxlength="100" placeholder="Ciudad" required />
        <input v-model="newEmployee.address" maxlength="255" placeholder="Dirección" required />
        <input v-model="newEmployee.postalCode" maxlength="5" @input="validatePostalCode" placeholder="Código postal" required />
        <input v-model="newEmployee.password" maxlength="60" type="password" placeholder="Contraseña" required minlength="8" />
        <input v-model="newEmployee.confirmPassword" maxlength="60" type="password" placeholder="Confirmar contraseña" required minlength="8" />

        <div class="actions">
            <AppButton type="submit" :disabled="isLoading">
                {{ isLoading ? 'Registrando...' : 'Registrar' }}
            </AppButton>
        </div>
    </form>
</template>

<style scoped>
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1rem; }
    .actions { grid-column: span 2; display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
    input, select { padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; }
</style>