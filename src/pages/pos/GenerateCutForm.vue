<script setup>
    import { ref } from 'vue'
    import { generateCut } from '@/repositories/SalesRepository'
    import Button from '@/components/Button.vue'
    import { useToast } from 'vue-toastification'
    import { getCutDetails } from '@/repositories/SalesRepository'

    const toast = useToast()
    const isLoading = ref(false)
    const cutData = ref(null)

    const showDetails = ref(false)
    const saleDetails = ref([])

    const range = ref({
        from: new Date().toISOString().split('T')[0] + 'T00:00',
        to: new Date().toISOString().split('T')[0] + 'T23:59'
    })

    async function handleGenerateCut() {
        isLoading.value = true
        const result = await generateCut(range.value.from, range.value.to)
    
        if (result.success) {
            cutData.value = result.data
            toast.info(result.msg)
        } else {
            toast.warning(result.msg)
        }
        isLoading.value = false
    }

    async function openDetails() {
        saleDetails.value = await getCutDetails(range.value.from, range.value.to)
        showDetails.value = true
    }
</script>

<template>
  <div class="flex flex-col gap-6 p-2">
    <div class="flex flex-col gap-4 bg-gray-700 p-4 rounded-xl">
      <div class="flex flex-col gap-1">
        <label class="text-white text-sm font-semibold">Desde</label>
        <input
          type="datetime-local"
          v-model="range.from"
          class="bg-gray-200 rounded-md p-2 text-sm"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-white text-sm font-semibold">Hasta</label>
        <input
          type="datetime-local"
          v-model="range.to"
          class="bg-gray-200 rounded-md p-2 text-sm"
        />
      </div>

      <Button
        text="Calcular corte"
        :on-click="handleGenerateCut"
        buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
      />
    </div>

    <div
      v-if="cutData"
      class="flex flex-col gap-3 bg-white p-6 rounded-xl border border-gray-400 shadow-inner"
    >
      <h4 class="text-gray-800 font-bold border-b pb-2 text-center text-lg">
        Balance Final
      </h4>

      <div class="flex justify-between text-sm">
        <span class="text-gray-600 italic">Generado por:</span>
        <span class="font-bold text-indigo-700">
          {{ cutData.generatedByEmployeeName }}
        </span>
      </div>

      <div class="flex justify-between text-sm">
        <span>Ventas realizadas:</span>
        <span class="font-bold">{{ cutData.totalSales }}</span>
      </div>

      <div class="flex justify-between">
        <span>Efectivo:</span>
        <span class="font-bold text-green-600">
          ${{ cutData.cashTotal.toFixed(2) }}
        </span>
      </div>

      <div class="flex justify-between">
        <span>Tarjeta:</span>
        <span class="font-bold text-blue-600">
          ${{ cutData.bankCardTotal.toFixed(2) }}
        </span>
      </div>

      <div class="flex justify-between">
        <span>Transferencia:</span>
        <span class="font-bold text-purple-600">
          ${{ cutData.transferTotal.toFixed(2) }}
        </span>
      </div>

      <hr />

      <div class="flex justify-between text-xl">
        <span class="font-bold">Gran total:</span>
        <span class="font-black text-indigo-700">
          ${{ cutData.grandTotal.toFixed(2) }}
        </span>
      </div>

      <Button
        text="Ver detalle del corte"
        :on-click="openDetails"
        buttonClass="bg-indigo-700 text-white mt-2"
      />

      <PopUp v-if="showDetails" :onClosed="() => (showDetails = false)">
        <h3 class="font-bold text-lg mb-3">Detalle de ventas</h3>

        <table class="w-full text-sm border">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-2">Fecha</th>
              <th class="p-2">Hora</th>
              <th class="p-2">Forma de pago</th>
              <th class="p-2">Monto</th>
            </tr>
          </thead>

          <tbody>
            <template v-for="sale in saleDetails" :key="sale.date">
              <tr class="bg-gray-100 font-semibold">
                <td>{{ sale.date.split('T')[0] }}</td>
                <td>{{ sale.date.split('T')[1].substring(0, 5) }}</td>
                <td>{{ sale.paymentMethod }}</td>
                <td>${{ sale.total.toFixed(2) }}</td>
              </tr>

              <tr
                v-for="(product, index) in sale.products"
                :key="`${sale.date}-${product.productName}-${index}`"
                class="bg-gray-50"
              >
                <td colspan="2" class="pl-6">
                    • {{ product.productName }}
                </td>
                <td>
                    {{ product.quantity }} x ${{ product.unitPrice.toFixed(2) }}
                </td>
                <td class="font-bold">
                    ${{ product.subtotal.toFixed(2) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </PopUp>
    </div>
  </div>
</template>