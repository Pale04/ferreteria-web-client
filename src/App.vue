<script setup>
  //example of accessing to a global state
  import { useSessionStore } from '@/stores/session';
  const session = useSessionStore()

  import index from './pages/providers/index.vue';
</script>

<template>
  <index/>
</template>

<style scoped></style>
