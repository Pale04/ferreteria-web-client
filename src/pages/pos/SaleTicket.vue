<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getSaleById } from '@/repositories/SalesRepository'

  const route = useRoute()
  const sale = ref(null)

  const paymentMethod = ref(null)
  const paymentDetails = ref(null)

  function formatDate(date) {
    return new Date(date).toLocaleDateString()
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString()
  }


  onMounted(async () => {
    const saleId = route.params.id

    paymentMethod.value = history.state.paymentMethod
    paymentDetails.value = history.state.paymentDetails

    const result = await getSaleById(saleId)
    if (result.success) {
      sale.value = result.data
      setTimeout(() => window.print(), 300)
    }
  })
</script>

<template>
  <div v-if="sale" id="ticket" class="ticket">
    <h2 class="title">FERRETERÍA WEB</h2>
    <p class="subtitle">Ticket de compra</p>

    <hr/>

    <p><strong>Fecha:</strong> {{ formatDate(sale.date) }}</p>
    <p><strong>Hora:</strong> {{ formatTime(sale.date) }}</p>
    <p><strong>Empleado:</strong> {{ sale.employee }}</p>
    <p><strong>Folio:</strong> {{ sale.id }}</p>

    <hr/>

    <table class="products">
      <thead>
        <tr>
          <th>Prod.</th>
          <th>Cant.</th>
          <th>Precio</th>
          <th>Subt.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in sale.products" :key="i">
          <td>{{ p.name }}</td>
          <td>{{ p.quantity }}</td>
          <td>${{ p.price.toFixed(2) }}</td>
          <td>${{ (p.quantity * p.price).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <hr/>

    <p class="total"><strong>Total:</strong> ${{ sale.total.toFixed(2) }}</p>
    <p><strong>Método de pago:</strong> {{ paymentMethod }}</p>

    <div v-if="paymentMethod === 'cash'">
      <p>Monto recibido: ${{ paymentDetails.received.toFixed(2) }}</p>
      <p>Cambio: ${{ paymentDetails.change.toFixed(2) }}</p>
    </div>

    <div v-if="paymentMethod === 'bankCard'">
      <p>Banco: {{ paymentDetails.bank }}</p>
      <p>Tarjeta: **** {{ paymentDetails.last4 }}</p>
      <p>Titular: {{ paymentDetails.holder }}</p>
    </div>

    <div v-if="paymentMethod === 'transfer'">
      <p>Referencia: {{ paymentDetails.reference }}</p>
      <p>Fecha: {{ paymentDetails.date }}</p>

    </div>
        <hr/>
        <p class="thanks">¡Gracias por su compra!</p>
        <p class="footer">Este comprobante no es una factura.</p>
  </div>
</template>