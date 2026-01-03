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
  <!-- Botón secundario -->
  <div class="flex justify-end mb-4">
    <button
      class="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
      @click="openRegisterCategory"
    >
      Registrar categoría
    </button>
  </div>

  <AppTable
    title="Inventario"
    description="Gestión de categorías y productos"
    :headers="['Nombre', 'Descripción', 'Productos']"
    :on-add="openRegisterProduct"
  >
    <template #default>
      <tr v-for="category in categories" :key="category.id">
        <td class="font-semibold">{{ category.name }}</td>
        <td>{{ category.description || '—' }}</td>
        <td>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="product in category.products"
              :key="product.id"
              class="border rounded p-2 bg-gray-50"
            >
              <p class="font-medium">{{ product.name }}</p>
              <p class="text-xs text-gray-600">
                ${{ product.price }} · Stock: {{ product.stock }}
              </p>
            </div>

            <span v-if="!category.products.length" class="text-xs text-gray-400">
              Sin productos
            </span>
          </div>
        </td>
      </tr>
    </template>
  </AppTable>

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
