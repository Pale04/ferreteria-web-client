<script setup>
    import { ref, onMounted } from 'vue'
    import AppButton from '@/components/AppButton.vue'
    import AppToastNotification from '@/components/AppToastNotification.vue'
    import EmployeesRepository from '@/repositories/EmployeesRepository'

    const props = defineProps({
        employeeId: {
            type: Number,
            required: true
        }
    })

    const emit = defineEmits([null])

    const toast = ref({
        show: false,
        message: '',
        type: 'success'
    })

    const isLoading = ref(false)
    const isFetching = ref(true)

    const employee = ref({
        name: '',
        lastName: '',
        secondLastName: '',
        phone: '',
        birthDate: '',
        gender: '',
        city: '',
        address: '',
        postalCode: ''
    })

    function showMessage(msg, type = 'success') {
        toast.value.message = msg
        toast.value.type = type
        toast.value.show = true
        setTimeout(() => toast.value.show = false, 5000)
    }

    function validatePhone(event) {
        employee.value.phone = event.target.value.replace(/\D/g, '');
    }

    function validatePostalCode(event) {
        employee.value.postalCode = event.target.value.replace(/\D/g, '');
    }

    async function fetchEmployeeData() {
        try {
            isFetching.value = true
            const data = await EmployeesRepository.getEmployeeById(props.employeeId)
            
            employee.value = {
                name: data.name,
                lastName: data.lastName,
                secondLastName: data.secondLastName,
                phone: data.phone,
                birthDate: (data.birthDate)?.split('T')[0],
                gender: data.gender,
                city: data.city,
                address: data.address,
                postalCode: data.postalCode
            }
        } catch (error) {
            const errorMsg = error.response?.data || "No fue posible recuperar la información del empleado. Por favor intente más tarde."
            showMessage(errorMsg, "error")
        } finally {
            isFetching.value = false
        }
    }

    onMounted(fetchEmployeeData)

    async function sendUpdate() {
        try {
            isLoading.value = true
            await EmployeesRepository.updateEmployee(props.employeeId, employee.value)
            emit('updated')
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
            Actualizar datos de Empleado
        </p>
    </div>

    <AppToastNotification 
      v-model="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
    />

    <div v-if="isFetching" class="text-center py-10">
        <p class="text-gray-500 italic text-sm animate-pulse">Cargando datos del empleado...</p>
    </div>

    <form v-else @submit.prevent="sendUpdate" class="form-grid">
        <div>
            <label class="font-semibold">Nombre:</label>
            <input v-model="employee.name" maxlength="50" placeholder="Nombre(s)" required />
        </div>

        <div>
            <label class="font-semibold">Apellido paterno:</label>
            <input v-model="employee.lastName" maxlength="50" placeholder="Apellido paterno" required />
        </div>

        <div>
            <label class="font-semibold">Apellido materno:</label>
            <input v-model="employee.secondLastName" maxlength="50" placeholder="Apellido materno (opcional)" />
        </div>

        <div>
            <label class="font-semibold">Teléfono:</label>
            <input v-model="employee.phone" maxlength="10" @input="validatePhone" placeholder="Teléfono" required />
        </div>

        <div>
            <label class="font-semibold">Fecha de nacimiento:</label>
            <input v-model="employee.birthDate" type="date" required />
        </div>

        <div>
            <label class="font-semibold">Género:</label>
            <select v-model="employee.gender" required>
                <option value="">Seleccionar género:</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
            </select>
        </div>

        <div>
            <label class="font-semibold">Ciudad:</label>
            <input v-model="employee.city" maxlength="100" placeholder="Ciudad" required />
        </div>

        <div>
            <label class="font-semibold">Dirección:</label>
            <input v-model="employee.address" maxlength="255" placeholder="Dirección" required />
        </div>

        <div>
            <label class="font-semibold">Código postal:</label>
            <input v-model="employee.postalCode" maxlength="5" @input="validatePostalCode" placeholder="Código postal" required />
        </div>

        <div class="actions">
            <AppButton class="updateButton" type="submit" :disabled="isLoading">
                {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
            </AppButton>
        </div>
    </form>
</template>

<style scoped>
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1rem; }
    .actions { grid-column: span 2; display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
    input, select { padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; }
    .updateButton { background-color: green; } 
    .updateButton:hover:not(:disabled) { background-color: darkgreen; transform: translateY(-1px); }
</style>