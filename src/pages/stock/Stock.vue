<script setup>
import { ref, onMounted, computed } from 'vue'
import AppTable from '@/components/Table/AppTable.vue'
import RegisterCategoryModal from '@/components/Categories/RegisterCategoryModal.vue'
import RegisterProductModal from '@/components/Products/RegisterProductModal.vue'
import { getActiveCategories } from '@/repositories/CategoryRepository'

const categories = ref([])
const loading = ref(false)

const showRegisterCategoryModal = ref(false)
const showRegisterProductModal = ref(false)

const searchTerm = ref('')

const filteredCategories = computed(() => {
  if (!searchTerm.value.trim()) {
    return categories.value
  }

  const term = searchTerm.value.toLowerCase()

  return categories.value.filter(category =>
    category.name.toLowerCase().includes(term)
  )
})

function openRegisterProduct() {
  showRegisterProductModal.value = true
}

function openRegisterCategory() {
  showRegisterCategoryModal.value = true
}

function onProductRegistered() {
  showRegisterProductModal.value = false
  loadCategories()
}

function onCategoryRegistered() {
  showRegisterCategoryModal.value = false
  loadCategories()
}

async function loadCategories() {
  loading.value = true
  try {
    categories.value = await getActiveCategories()
  } finally {
    loading.value = false
  }
}

onMounted(loadCategories)
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
    <h1 class="text-xl font-semibold">Inventario</h1>

    <div class="flex gap-2">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar categoría..."
        class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        class="btn-secondary"
        @click="openRegisterCategory"
      >
        Registrar categoría
      </button>
    </div>
  </div>
  <AppTable
    title="Categorías"
    description="Gestión de categorías de productos"
    :headers="['Nombre', 'Descripción', 'Productos', 'Acciones']"
    :on-add="openRegisterProduct"
  >
    <template #default>
      <tr v-for="category in filteredCategories" :key="category.id">
        <td class="font-semibold">{{ category.name }}</td>
        <td>{{ category.description || '—' }}</td>

        <td class="text-center">
          {{ category.products.length }}
        </td>

        <td>
          <button
            class="btn-primary-sm"
            @click="$router.push(`/stock/category/${category.id}`)"
          >
            Ver productos
          </button>
        </td>
      </tr>
      <tr v-if="!filteredCategories.length">
        <td colspan="4" class="text-center text-gray-400 py-6">
          No se encontraron categorías con ese nombre
        </td>
      </tr>
    </template>
  </AppTable>

  <!-- Modales -->
  <RegisterProductModal
    v-if="showRegisterProductModal"
    @close="showRegisterProductModal = false"
    @success="onProductRegistered"
  />

  <RegisterCategoryModal
    v-if="showRegisterCategoryModal"
    @close="showRegisterCategoryModal = false"
    @success="onCategoryRegistered"
  />
</template>

