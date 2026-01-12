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
  :class="`${buttonClass} flex items-center justify-center font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out`">
    <i v-if="iconClass != null" :class="`${iconClass} mr-2 text-cordes-accent group-hover:text-white`"></i>
    {{ text }}
  </button>
</template>
