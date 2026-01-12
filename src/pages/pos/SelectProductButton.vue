<script setup>
  import Button from '@/components/Button.vue';

  defineProps({
    id: Number
  })
</script>

<template>
  <Button text="Seleccionar" @click="$emit('selected', id)" button-class="bg-green-600 hover:bg-green-700 text-white" icon-class="pi pi-plus"/>
</template>
