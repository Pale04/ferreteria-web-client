<script setup>
    import { ref } from 'vue'
    import { generateCut } from '@/repositories/SalesRepository'
    import Button from '@/components/Button.vue'
    import { useToast } from 'vue-toastification'

    const toast = useToast()
    const isLoading = ref(false)
    const cutData = ref(null)

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

    const handlePrint = () => {
      window.print();
    };
</script>

<template>
  <div class="flex flex-col gap-6 p-2">
    <div class="flex flex-col gap-4 bg-gray-700 p-4 rounded-xl">
      <div class="flex flex-col gap-1">
        <label class="text-white text-sm font-semibold">Desde</label>
        <input type="datetime-local" v-model="range.from" class="bg-gray-200 rounded-md p-2 text-sm" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-white text-sm font-semibold">Hasta</label>
        <input type="datetime-local" v-model="range.to" class="bg-gray-200 rounded-md p-2 text-sm" />
      </div>

      <Button text="Calcular corte" :on-click="handleGenerateCut" buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white mt-2" />
    </div>

    <div v-if="cutData" class="flex flex-col gap-3 bg-white p-6 rounded-xl border border-gray-400 shadow-inner">
        <h4 class="text-gray-800 font-bold border-b pb-2 text-center text-lg">Balance Final</h4>

        <div class="flex justify-between items-center text-sm mb-2">
            <span class="text-gray-600 italic">Generado por:</span>
            <span class="font-bold text-indigo-700">{{ cutData.generatedByEmployeeName }}</span>
        </div>

        <div class="flex justify-between items-center text-sm">
            <span class="text-gray-600">Ventas realizadas:</span>
            <span class="font-bold text-gray-800">{{ cutData.totalSales }}</span>
        </div>

        <div class="flex justify-between items-center text-md">
            <span class="text-gray-600">Efectivo:</span>
            <span class="font-bold text-green-600">${{ cutData.cashTotal.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between items-center text-md">
            <span class="text-gray-600">Tarjeta:</span>
            <span class="font-bold text-blue-600">${{ cutData.bankCardTotal.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between items-center text-md">
            <span class="text-gray-600">Transferencia:</span>
            <span class="font-bold text-purple-600">${{ cutData.transferTotal.toFixed(2) }}</span>
        </div>

        <hr class="border-gray-300">

        <div class="flex justify-between items-center text-xl">
            <span class="font-bold text-gray-800">Gran total:</span>
            <span class="font-black text-indigo-700">${{ cutData.grandTotal.toFixed(2) }}</span>
        </div>

        <Button 
            text="Imprimir reporte" 
            :on-click="handlePrint" 
            buttonClass="bg-gray-800 text-white mt-4" 
            icon-class="pi pi-print"
        />
    </div>
  </div>
</template>