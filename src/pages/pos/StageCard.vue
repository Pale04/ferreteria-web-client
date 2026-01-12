<script setup>
  import { ref, watch } from 'vue';

  const emit = defineEmits(['subtotalChanged', 'removed'])

  const props = defineProps({
    product: Object
  })

  const amount = ref(1)

  function validateAmountInput(event) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if ((!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key))) {
      event.preventDefault();
    }
  }

  watch(amount, (newValue, oldValue) => {
    if (newValue < 1 || newValue > props.product.stock) {
      props.product.isValid = false
    } else {
      props.product.isValid = true
    }

    props.product.quantity = newValue
    emit('subtotalChanged', newValue * props.product.price, oldValue * props.product.price)
  })
</script>

<template>
  <li class="w-full mb-5 flex flex-row bg-gray-200 p-3 rounded-md shadow-md">

    <div class="flex flex-col w-full">
      <div class="flex flex-row justify-between items-center gap-2 mb-2">
        <div class="flex flex-col">
          <h3 class="text-md font-semibold">{{ product.name }}</h3>
          <p class="text-sm text-gray-500">{{ product.description }}</p>
        </div>

        <div class="flex flex-col items-end">
          <p class="text-lg font-bold ">${{ product.price.toFixed(2) }}</p>
          <p class="text-sm text-gray-500">
            En inventario: <span class="font-bold">{{ product.stock }} unidad</span>
          </p>
        </div>
      </div>

      <hr>

      <div class="flex flex-row justify-between items-center mt-4">
        <div class="flex flex-row gap-2 items-center">
          <label for="amount" class="font-md text-md text-gray-500">Cantidad:</label>
          <input
            v-model="amount"
            :id="`amount-${product.id}`"
            name="amount"
            type="number"
            min="1"
            :max="product.stock"
            @keydown="validateAmountInput"
            placeholder="Cantidad"
            :class="`border-2 bg-white w-30 rounded-md p-1 ${product.isValid ? '' : 'border-red-500 focus:border-red-500 focus:ring-red-500'}`"
          />
          <span v-if="!product.isValid" class="text-sm text-red-600">Cantidad no válida</span>
        </div>

        <p class="font-sm text-lg text-gray-500">
          Subtotal: <span class="font-bold">${{ (amount * product.price).toFixed(2) }}</span>
        </p>
      </div>
    </div>

    <div class="flex flex-col">
      <i
        @click.prevent="$emit('removed', product.id)"
        class="pi pi-times ml-4 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-3xl">
      </i>
    </div>

  </li>
</template>
