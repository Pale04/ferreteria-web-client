<script setup>
  defineProps({
    text: String,
    onClick: Function,
    iconClass: String,
    buttonClass: String,
  })
</script>

<template>
  <button
  @click.prevent="onClick"
  :class="`${buttonClass} font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out`">
    <i :class="`${iconClass} mr-1 text-cordes-accent group-hover:text-white`"></i>
    {{ text }}
  </button>
</template>
