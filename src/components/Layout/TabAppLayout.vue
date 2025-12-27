<script setup>
import { reactive } from 'vue';

defineProps({
  title: String,
  iconClass: String,
  route: String
})

import { RouterLink, useRoute } from 'vue-router';

const isActiveTab = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
}
</script>

<template>
  <RouterLink
  :to="route"
  :class="`${isActiveTab(route)? 'bg-gray-500' : 'hover:bg-gray-500'} flex items-center px-4 py-3 text-gray-300 hover:text-white rounded-lg transition-colors group`">

    <i :class="`${iconClass} mr-3 text-cordes-accent group-hover:text-white`"></i>
    {{ title }}

  </RouterLink>
</template>
