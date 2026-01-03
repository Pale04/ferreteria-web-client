<script setup>
import { ref } from 'vue'
import { registerCategory } from '@/repositories/CategoryRepository'
import PopUp from '@/components/PopUp.vue'
import Button from '@/components/Button.vue'

const emit = defineEmits(['close', 'success'])

const name = ref('')
const description = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function submit() {
  errorMessage.value = ''

  if (!name.value.trim() || !description.value.trim()) {
    errorMessage.value = 'Por favor llene todos los campos obligatorios'
    return
  }

  try {
    isSubmitting.value = true

    await registerCategory({
      name: name.value,
      description: description.value
    })

    emit('success')
    emit('close')
  } catch (error) {
    if (error.response?.status === 400) {
      errorMessage.value = error.response.data
    } else {
      errorMessage.value = 'Ocurrió un error inesperado. Por favor intente más tarde'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <PopUp title="Registrar categoría" @close="emit('close')">
    <div class="space-y-4">

      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          v-model="name"
          type="text"
          class="mt-1 w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          v-model="description"
          rows="3"
          class="mt-1 w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>

      <div class="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          buttonClass="bg-gray-300 hover:bg-gray-400"
          :on-click="() => emit('close')"
        />
        <Button
          text="Registrar"
          buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white"
          :on-click="submit"
          :disabled="isSubmitting"
        />
      </div>

    </div>
  </PopUp>
</template>
