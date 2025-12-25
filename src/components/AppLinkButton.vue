<script setup>
  import { defineProps } from 'vue';

  defineProps({
    description: String,
    onClick: Function
  })
</script>

<template>
  <button>
    <a @click="onClick" class="text-indigo-600 hover:text-indigo-900 mr-3">
      {{ description }}
    </a>
  </button>
</template>
