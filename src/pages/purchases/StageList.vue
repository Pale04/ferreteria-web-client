<script setup>
import StageCard from "@/pages/purchases/StageCard.vue";

const props = defineProps({
  products: {
    type: Map,
    default: new Map(),
  },
});

function removeProductFromStage(id) {
  props.products.delete(id);
}
</script>

<template>
  <ul class="overflow-hidden max-w mx-auto">
    <StageCard
      v-for="product in products"
      :product="product[1]"
      :key="product[0]"
      @removed="removeProductFromStage"
    />
  </ul>
</template>
