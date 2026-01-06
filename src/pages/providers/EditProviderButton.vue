<script setup>
  import AppLinkButton from '@/components/AppLinkButton.vue';

  defineProps({
    id: Number,
    text: String
  })
</script>

<template>
  <AppLinkButton :description="text" @click="$emit('clicked', id)"/>
</template>
