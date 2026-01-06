<script setup>
  import Button from '@/components/Button.vue';

  defineProps({
    title: String,
    description: String,
    headers: Array,
    onAdd: Function,
  })
</script>

<template>
  <div class="w-full flex items-center justify-center min-h-full p-2">
    <div class="container">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">

        <div class="p-6 border-b border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-xl font-bold uppercase text-gray-800">
                {{ title }}
              </h2>
              <p class="text-gray-500 mt-1">{{ description }}</p>
            </div>
            <div class="mt-4 md:mt-0">
              <Button text="Agregar" :on-click="onAdd" buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white"/>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="header of headers" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ header }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <slot></slot>
            </tbody>

          </table>
        </div>
      </div>
    </div>
  </div>
</template>
