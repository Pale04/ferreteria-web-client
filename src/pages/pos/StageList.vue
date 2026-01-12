<script setup>
  import StageCard from './StageCard.vue';

  const emit = defineEmits(['subtotalChanged'])

  const props = defineProps({
    products: {
      type: Map,
      default: new Map()
    }
  })

  function removeProductFromStage(id) {
    const product = props.products.get(id)
    props.products.delete(id)
    updateSaleTotal(0, product.quantity * product.price)
  }

  function updateSaleTotal(newSubtotal, oldSubtotal) {
    emit('subtotalChanged', newSubtotal, oldSubtotal)
  }
</script>

<template>
  <ul class="overflow-hidden max-w mx-auto">
    <StageCard
      v-for="product in products"
      :product="product[1]"
      :key="product[0]"
      @removed="removeProductFromStage"
      @subtotal-changed="updateSaleTotal"
    />
  </ul>
</template>
