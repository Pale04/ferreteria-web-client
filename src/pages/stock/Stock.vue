<script setup>
import { ref, onMounted } from 'vue'
import AppTable from '@/components/Table/AppTable.vue'
import RegisterCategoryModal from '@/components/Categories/RegisterCategoryModal.vue'
import RegisterProductModal from '@/components/Products/RegisterProductModal.vue'
import { getActiveCategories } from '@/repositories/CategoryRepository'

const categories = ref([])
const loading = ref(false)

const showRegisterCategoryModal = ref(false)
const showRegisterProductModal = ref(false)

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
  <!-- Acciones superiores -->
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-xl font-semibold">Inventario</h1>

    <div class="flex gap-2">
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
      <tr v-for="category in categories" :key="category.id">
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

