<script setup>
import { ref, onMounted } from 'vue'
import AppTable from '@/components/Table/AppTable.vue'
import RegisterCategoryModal from '@/components/Categories/RegisterCategoryModal.vue'
import { getActiveCategories } from '@/repositories/CategoryRepository'
import { registerCategory } from '@/repositories/CategoryRepository'

const showRegisterModal = ref(false)
const categories = ref([])
const loading = ref(false)

function openRegister() {
  showRegisterModal.value = true
}

async function loadCategories() {
  loading.value = true
  try {
    categories.value = await getActiveCategories()
  } finally {
    loading.value = false
  }
}


function onSuccess() {
  showRegisterModal.value = false
  loadCategories()
}

onMounted(loadCategories)
</script>

<template>
  <AppTable
    title="Categorías"
    description="Gestión de categorías de productos"
    :headers="['Nombre', 'Descripción', 'Productos']"
    :on-add="openRegister"
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

  <RegisterCategoryModal
    v-if="showRegisterModal"
    @close="showRegisterModal = false"
    @success="onSuccess"
  />
</template>
