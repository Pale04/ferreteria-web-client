<script setup>
import { ref, onMounted } from 'vue'
import { getActiveCategories } from '@/repositories/CategoryRepository'
import { updateProduct } from '@/repositories/ProductRepository'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const categories = ref([])
const loading = ref(false)
const errorMessage = ref('')

/* Toast */
const showToast = ref(false)
const toastMessage = ref('')

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: null,
  isActive: true
})

onMounted(async () => {
  categories.value = await getActiveCategories()

  form.value = {
    name: props.product.name,
    description: props.product.description,
    price: props.product.price,
    stock: props.product.stock,
    categoryId: props.product.categoryId,
    isActive: props.product.isActive
  }
})

async function submit() {
  errorMessage.value = ''

  if (!form.value.name || !form.value.price || !form.value.categoryId) {
    errorMessage.value = 'Por favor complete los campos obligatorios'
    return
  }

  loading.value = true

 try {
  const response = await updateProduct(props.product.id, {
    name: form.value.name,
    description: form.value.description,
    price: Number(form.value.price),
    stock: Number(form.value.stock),
    categoryId: Number(form.value.categoryId),
    isActive: form.value.isActive
  })

  emit('success', response.message)
  emit('close')

} catch (error) {
  errorMessage.value =
    error?.data ??
    'Ocurrió un error inesperado. Por favor intente más tarde'
}
 finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl w-full max-w-xl p-6 animate-scale-in">

      <h2 class="text-xl font-semibold mb-6">
        Actualizar producto
      </h2>

      <div class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium mb-1">
            Nombre *
          </label>
          <input v-model="form.name" class="input" />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium mb-1">
            Descripción
          </label>
          <textarea v-model="form.description" class="input" />
        </div>

        <!-- Precio + Stock -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">
              Precio *
            </label>
            <input
              v-model="form.price"
              type="number"
              min="0.01"
              step="0.01"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              Stock
            </label>
            <input
              v-model="form.stock"
              type="number"
              min="0"
              class="input"
            />
          </div>
        </div>

        <!-- Categoría -->
        <div>
          <label class="block text-sm font-medium mb-1">
            Categoría *
          </label>
          <select v-model="form.categoryId" class="input">
            <option disabled value="">Seleccione una categoría</option>
            <option
              v-for="c in categories"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name }}
            </option>
          </select>
        </div>

        <!-- Activo -->
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="form.isActive" />
          Producto activo
        </label>

        <!-- Error -->
        <p v-if="errorMessage" class="text-red-600 text-sm">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Acciones -->
      <div class="flex justify-end gap-3 pt-6">
        <button class="btn-secondary" @click="emit('close')">
          Cancelar
        </button>
        <button
          class="btn-primary"
          :disabled="loading"
          @click="submit"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showToast"
    class="fixed top-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in"
  >
    {{ toastMessage }}
  </div>
</template>
