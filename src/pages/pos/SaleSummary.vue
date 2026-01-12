<script setup>
  import { ref } from 'vue';
  import Button from '@/components/Button.vue';

  defineProps({
    total: {
      type: Number,
      default: 0.0
    }
  })

  const paymentMethod = ref('cash')
</script>

<template>
  <div class="w-130 h-full bg-gray-800 shadow-xl rounded-md flex flex-col px-4 py-6 md:p-6 xl:p-8 space-y-6">

    <h3 class="text-2xl text-white font-bold">Resumen</h3>

    <div class="flex justify-center items-center w-full space-y-4 flex-col gap-5 border-gray-200 border-b pb-4">

      <div class="flex flex-col items-start w-full gap-1">
        <p class="text-lg font-semibold text-white">Método de pago</p>
        <div class="flex flex-col gap-1">
          <div class="flex flex-row gap-2">
            <input type="radio" id="cash" value="cash" v-model="paymentMethod" />
            <label for="cash" class="text-base text-white">Efectivo</label>
          </div>
          <div class="flex flex-row gap-2">
            <input type="radio" id="bankCard" value="bankCard" v-model="paymentMethod" />
            <label for="bankCard" class="text-base text-white">Tarjeta bancaria</label>
          </div>
          <div class="flex flex-row gap-2">
            <input type="radio" id="transfer" value="transfer" v-model="paymentMethod"/>
            <label for="transfer" class="text-base text-white">Transferencia</label>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center w-full">
      <p class="text-xl text-white font-bold">Total</p>
      <p class="text-xl text-gray-300 font-bold">${{ total.toFixed(2) }}</p>
    </div>

    <Button text="Confirmar compra" @click.prevent="$emit('saleConfirmed', paymentMethod)" button-class="bg-indigo-600 hover:bg-indigo-700 text-white"/>
  </div>
</template>
