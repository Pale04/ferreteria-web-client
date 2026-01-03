<script setup>
  defineProps({
    label: String,
    type: String,
    id: String,
    name: String,
    placeholder: {
      type: String,
      defaul: ''
    },
    required: Boolean
  })

  const model = defineModel()
</script>

<template>
  <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
  <input
    v-model.trim="model"
    :type="type"
    :id="id"
    :name="name"
    :placeholder="placeholder"
    class="py-2 px-2 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 hover:shadow-sm"
    :required="required"
  />
</template>
