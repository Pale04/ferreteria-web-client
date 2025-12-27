<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    field: String,
    class: String
  })
</script>

<template>
  <td :class="`${props.class} px-6 py-4 whitespace-nowrap`">
    <div v-if="field" class="text-sm text-gray-900">
      {{ field }}
    </div>
    <slot v-else></slot>
  </td>
</template>
