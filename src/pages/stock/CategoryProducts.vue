<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductsByCategory } from '@/repositories/ProductRepository'
import EditProductModal from '@/components/Products/EditProductModal.vue'

const route = useRoute()
const router = useRouter()

const categoryId = route.params.id
const products = ref([])
const loading = ref(false)

const searchTerm = ref('')

const showEditModal = ref(false)
const selectedProduct = ref(null)

const showToast = ref(false)
const toastMessage = ref('')

const filteredProducts = computed(() => {
  if (!searchTerm.value.trim()) {
    return products.value
  }

  const term = searchTerm.value.toLowerCase()

  return products.value.filter(product =>
    product.name.toLowerCase().includes(term)
  )
})

function openEdit(product) {
  selectedProduct.value = product
  showEditModal.value = true
}

function onProductUpdated(message) {
  showEditModal.value = false
  loadProducts()

  toastMessage.value = message
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

async function loadProducts() {
  loading.value = true
  try {
    products.value = await getProductsByCategory(categoryId)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/stock')
}

onMounted(loadProducts)
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
    <h1 class="text-xl font-semibold">Productos de la categoría</h1>

    <div class="flex gap-2">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar producto..."
        class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button class="btn-secondary" @click="goBack">
        Volver
      </button>
    </div>
  </div>

  <div v-if="loading" class="text-gray-500">
    Cargando productos...
  </div>

  <div
    v-else
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  >
    <div
      v-for="product in filteredProducts"
      :key="product.id"
      class="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
    >
      <div>
        <h2 class="font-semibold text-lg mb-1">
          {{ product.name }}
        </h2>

        <p class="text-sm text-gray-500 mb-3">
          {{ product.description || 'Sin descripción' }}
        </p>

        <div class="text-sm text-gray-700">
          <p><strong>Precio:</strong> ${{ product.price }}</p>
          <p><strong>Stock:</strong> {{ product.stock }}</p>
        </div>
      </div>

      <div class="flex gap-2 mt-4">
        <button
          class="btn-primary-sm flex-1"
          @click="openEdit(product)"
        >
          Editar
        </button>
      </div>
    </div>

    <p
      v-if="!filteredProducts.length"
      class="text-gray-400 col-span-full text-center"
    >
      No se encontraron productos con ese nombre
    </p>
  </div>

  <EditProductModal
    v-if="showEditModal"
    :product="selectedProduct"
    @close="showEditModal = false"
    @success="onProductUpdated"
  />

  <div
    v-if="showToast"
    class="fixed top-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in"
  >
    {{ toastMessage }}
  </div>
</template>
