<template>
  <div v-if="modelValue" :class="['toast', type]">
    {{ message }}
  </div>
</template>

<script setup>
defineProps(['modelValue', 'message', 'type'])
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  z-index: 2000;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.success { background-color: #28a745; }
.error { background-color: #dc3545; }
</style>