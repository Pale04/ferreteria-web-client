<template>
  <button
    :type="type"
    class="app-button"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.app-button {
  background-color: #4a3aff;
  color: white;
  padding: 10px 203px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.app-button:hover:not(:disabled) {
  background-color: #3829e0;
  transform: translateY(-1px);
}

.app-button:active:not(:disabled) {
  transform: translateY(0);
}

.app-button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
