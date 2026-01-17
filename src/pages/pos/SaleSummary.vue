<script setup>
  import { ref, computed } from 'vue'
  import Button from '@/components/Button.vue'
  import AppInputField from '@/components/AppInputField.vue'

  const props = defineProps({
    total: {
      type: Number,
      default: 0.0
    }
  })

  const emit = defineEmits(['saleConfirmed'])

  const paymentMethod = ref('cash')

  const cashPayment = ref({
    receivedAmount: 0
  })

  const change = computed(() => {
    return cashPayment.value.receivedAmount - props.total
  })

  const cardPayment = ref({
    holderName: '',
    last4Digits: '',
    bank: ''
  })

  const transferPayment = ref({
    reference: '',
    date: ''
  })

  function canConfirmSale() {
    if (paymentMethod.value === 'cash') {
      return cashPayment.value.receivedAmount >= props.total
    }

    if (paymentMethod.value === 'bankCard') {
      return (
        cardPayment.value.holderName &&
        /^\d{4}$/.test(cardPayment.value.last4Digits) &&
        cardPayment.value.bank
      )
    }

    if (paymentMethod.value === 'transfer') {
      return transferPayment.value.reference && transferPayment.value.date
    }

    return false
  }

  function confirmSale() {
  emit('saleConfirmed', {
    method: paymentMethod.value,
    details:
      paymentMethod.value === 'cash'
        ? {
            received: cashPayment.value.receivedAmount,
            change: change.value
          }
        : paymentMethod.value === 'bankCard'
        ? {
            holder: cardPayment.value.holderName,
            last4: cardPayment.value.last4Digits,
            bank: cardPayment.value.bank
          }
        : {
            reference: transferPayment.value.reference,
            date: transferPayment.value.date
          }
  })
}

</script>

<template>
  <div class="w-130 h-full bg-gray-800 shadow-xl rounded-md flex flex-col px-4 py-6 space-y-6">

    <h3 class="text-2xl text-white font-bold">Resumen</h3>

    <div class="border-b border-gray-600 pb-4">
      <p class="text-lg font-semibold text-white mb-2">Método de pago</p>

      <div class="space-y-2 text-white">
        <label class="flex gap-2">
          <input type="radio" value="cash" v-model="paymentMethod" />
          Efectivo
        </label>
        <label class="flex gap-2">
          <input type="radio" value="bankCard" v-model="paymentMethod" />
          Tarjeta bancaria
        </label>
        <label class="flex gap-2">
          <input type="radio" value="transfer" v-model="paymentMethod" />
          Transferencia
        </label>
      </div>
    </div>

    <div v-if="paymentMethod === 'cash'" class="space-y-3 text-black">
      <AppInputField
        label="Monto recibido"
        type="number"
        v-model="cashPayment.receivedAmount"
      />
      <p>
        Cambio:
        <span
          :class="change < 0 ? 'text-red-400' : 'text-green-400'"
          class="font-bold"
        >
          ${{ change.toFixed(2) }}
        </span>
      </p>
    </div>

    <div v-if="paymentMethod === 'bankCard'" class="space-y-3 text-black">
      <AppInputField label="Nombre del titular" v-model="cardPayment.holderName"/>
      <AppInputField
        label="Últimos 4 dígitos"
        maxlength="4"
        v-model="cardPayment.last4Digits"
      />
      <select v-model="cardPayment.bank" class="p-2 rounded-md text-black">
        <option value="">Seleccionar banco</option>
        <option>BBVA</option>
        <option>Banamex</option>
        <option>Santander</option>
        <option>HSBC</option>
        <option>Otro</option>
      </select>
    </div>

    <div v-if="paymentMethod === 'transfer'" class="space-y-3 text-black">
      <AppInputField label="Referencia" v-model="transferPayment.reference" />
      <AppInputField type="date" label="Fecha" v-model="transferPayment.date" />
    </div>

    <div class="flex justify-between items-center text-white text-xl border-t border-gray-600 pt-4">
      <span class="font-bold">Total</span>
      <span class="font-bold">${{ total.toFixed(2) }}</span>
    </div>

    <Button
      text="Confirmar compra"
      :disabled="!canConfirmSale()"
      @click="confirmSale"
      button-class="bg-indigo-600 hover:bg-indigo-700 text-white"
    />
  </div>
</template>

<style scoped>
  :deep(label) {
    color: white;
  }
</style>
