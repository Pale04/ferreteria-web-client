<script setup>
  import { useSessionStore } from '@/stores/session';
  const session = useSessionStore()
</script>

<template>
  <div class=" left-4 right-4">
    <div class="bg-gray-800 rounded-lg p-4">
      <div class="flex items-center space-x-3">
        <img src="https://cdn-icons-png.flaticon.com/512/17003/17003310.png" alt="Admin" class="w-10 h-10 rounded-full">
        <div>
          <p class="text-white text-sm font-medium">{{ session.user.name }}</p>
          <p class="text-gray-400 text-xs">{{ session.isAdmin ? 'Administrador' : 'Employee' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
