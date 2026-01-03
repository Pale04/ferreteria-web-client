<script setup>
import { ref, onMounted } from 'vue'
import { getActiveCategories } from '@/repositories/CategoryRepository'
import { registerProduct } from '@/repositories/ProductRepository'

const emit = defineEmits(['close', 'success'])

const form = ref({
  name: '',
  description: '',
  price: '',
  initialStock: '',
  categoryId: ''
})

const categories = ref([])
const loading = ref(false)
const errorMessage = ref('')

async function loadCategories() {
  categories.value = await getActiveCategories()
}

async function submit() {
  errorMessage.value = ''

  if (
    !form.value.name ||
    !form.value.price ||
    !form.value.initialStock ||
    !form.value.categoryId
  ) {
    errorMessage.value = 'Por favor llene todos los campos obligatorios'
    return
  }

  loading.value = true
  try {
    await registerProduct({
      name: form.value.name,
      description: form.value.description,
      price: Number(form.value.price),
      initialStock: Number(form.value.initialStock),
      categoryId: Number(form.value.categoryId)
    })

    emit('success')
  } catch (err) {
    if (err.status === 400) {
      errorMessage.value = err.data || 'El producto ya se encuentra registrado'
    } else {
      errorMessage.value = 'Ocurrió un error inesperado. Por favor intente más tarde'
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
      <h2 class="text-xl font-semibold">Registrar producto</h2>

      <input
          v-model="form.name"
          type="text"
          placeholder="Nombre *"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          v-model="form.description"
          placeholder="Descripción"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-model="form.price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Precio *"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-model="form.initialStock"
          type="number"
          min="0"
          placeholder="Stock inicial *"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          v-model="form.categoryId"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione una categoría *</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>
      <div class="flex justify-end gap-3 pt-4">
        <button class="btn-secondary" @click="emit('close')">
          Cancelar
        </button>
        <button class="btn-primary" :disabled="loading" @click="submit">
          Registrar
        </button>
      </div>
    </div>
  </div>
</template>
