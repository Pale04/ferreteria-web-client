<script setup>
    import { ref, onMounted } from 'vue'
    import { useToast } from 'vue-toastification'
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

    const toast = useToast()

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
            toast.error(errorMsg)
        } finally {
            isFetching.value = false
        }
    }

    onMounted(fetchEmployeeData)

    async function confirmDelete() {
        const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar al empleado ${employee.value.name}? Esta acción no se puede deshacer.`);

        if (confirmed) {
            try {
                isLoading.value = true
                await EmployeesRepository.deleteEmployee(props.employeeId)
                emit('deleted')
            } catch (error) {
                const errorMsg = error.response?.data || "Ocurrió un error inesperado. Por favor intente más tarde."
                toast.error(errorMsg)
            } finally {
                isLoading.value = false
            }
        }
    }
</script>

<template>
    <div class="text-center">
        <p class="mb-3 text-2xl font-bold leading-5 text-slate-900 py-5">
            Dar de baja Empleado
        </p>
        <p class="deleteMsg font-semibold">
            El siguiente empleado será eliminado permanentemente junto con toda su información relacionada:
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

    <form v-else @submit.prevent="confirmDelete" class="form-grid">
        <div>
            <label class="font-semibold">Nombre:</label>
            <input v-model="employee.name" maxlength="50" placeholder="Nombre(s)" disabled="true"/>
        </div>

        <div>
            <label class="font-semibold">Apellido paterno:</label>
            <input v-model="employee.lastName" maxlength="50" placeholder="Apellido paterno" disabled="true"/>
        </div>

        <div>
            <label class="font-semibold">Apellido materno:</label>
            <input v-model="employee.secondLastName" maxlength="50" placeholder="Apellido materno (opcional)" disabled="true"/>
        </div>

        <div>
            <label class="font-semibold">Teléfono:</label>
            <input v-model="employee.phone" maxlength="10" @input="validatePhone" placeholder="Teléfono" disabled="true"/>
        </div>

        <div>
            <label class="font-semibold">Fecha de nacimiento:</label>
            <input v-model="employee.birthDate" type="date" disabled="true"/>
        </div>

        <div>
            <label class="font-semibold">Género:</label>
            <select v-model="employee.gender" disabled="true">
                <option value="">Seleccionar género:</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
            </select>
        </div>

        <div>
            <label class="font-semibold">Ciudad:</label>
            <input v-model="employee.city" maxlength="100" placeholder="Ciudad" disabled="true"/>
        </div>

        <div>
            <label class="font-semibold">Dirección:</label>
            <input v-model="employee.address" maxlength="255" placeholder="Dirección" disabled="true"/>
        </div>

        <div>
            <label class="font-semibold">Código postal:</label>
            <input v-model="employee.postalCode" maxlength="5" @input="validatePostalCode" placeholder="Código postal" disabled="true"/>
        </div>

        <div class="actions">
            <AppButton class="deleteButton" type="submit" :disabled="isLoading">
                {{ isLoading ? 'Eliminando...' : 'Eliminar empleado' }}
            </AppButton>
        </div>
    </form>
</template>

<style scoped>
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1rem; }
    .actions { grid-column: span 2; display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; }
    input, select { padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; }
    .deleteMsg { font-size: 17px; color: red; background: none; border: none; text-decoration: underline; }
    .deleteButton { background-color: red; } 
    .deleteButton:hover:not(:disabled) { background-color: darkred; transform: translateY(-1px); }
</style>