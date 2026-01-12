<script setup>
  import Button from '@/components/Button.vue';
  import SelectProductButton from '@/pages/pos/SelectProductButton.vue';
  import AppInputField from '@/components/AppInputField.vue';
  import { ref } from 'vue';
  import { getProductsById, getProductsBySearchString } from '@/repositories/ProductRepository'
  import { useToast } from 'vue-toastification';
  import PopUp from '@/components/PopUp.vue';
  import StageList from './StageList.vue';
  import SaleSummary from './SaleSummary.vue';
  import { useSessionStore } from '@/stores/session';
  import { addSale } from '@/repositories/SalesRepository';
  import GenerateCutForm from './GenerateCutForm.vue';

  const session = useSessionStore()
  const toast = useToast()
  const searchString = ref('')
  const isSearchResultVisible = ref(false)
  const searchResults = ref([])
  const saleTotal = ref(0)
  const productsInStage = ref(new Map())

  const isCutVisible = ref(false)

  function closeCut() {
    isCutVisible.value = false;
  }

  async function searchProduct() {
    if(searchString.value != '') {
      const result = await getProductsBySearchString(searchString.value)

      if(result.success) {
        searchResults.value = result.data
        isSearchResultVisible.value = true
      } else {
        toast.warning(result.msg)
      }
    }
  }

  function closeSearchResult() {
    isSearchResultVisible.value = false
  }

  function updateSaleTotal(newSubtotal, oldSubtotal) {
    saleTotal.value = saleTotal.value + newSubtotal - oldSubtotal
  }

  async function addProductToStage(id) {
    const result = await getProductsById(id)

    if (!result.success) {
      toast.info(result.msg)
    } else {
      let selectedProduct = result.data
      if (selectedProduct.stock < 1) {
        toast.warning('Actualmente no hay existencia del producto seleccionado')
        if (productsInStage.value.has(id)) {
          productsInStage.value.delete(id)
        }
      } else {
        if (productsInStage.value.has(id)) {
          const oldProduct = productsInStage.value.get(id)
          selectedProduct.quantity = oldProduct.quantity
          selectedProduct.isValid = oldProduct.isValid
        } else {
          selectedProduct.quantity = 1
          selectedProduct.isValid = true
          updateSaleTotal(selectedProduct.price, 0)
        }
        productsInStage.value.set(id, selectedProduct)
        isSearchResultVisible.value = false
      }
    }
  }

  async function confirmSale(paymentMethod) {
    const productsInStageAsIterator = productsInStage.value.values()

    let stageIsValid = true
    let i = 0
    while(i < productsInStage.value.size && stageIsValid) {
      stageIsValid = productsInStageAsIterator.next().value.isValid ?? true
      i++
    }

    if (stageIsValid){
      const saleDetails = []
      for(const product of productsInStage.value.values()) {
        saleDetails.push({
          productId: product.id,
          productQuantity: product.quantity
        })
      }

      const sale = {
        paymentMethod: paymentMethod,
        employeeId: session.user.id,
        saleDetails: saleDetails
      }

      const result = await addSale(sale)

      if (result.success) {
        toast.info('La compra se ha realizado exitosamente')
        productsInStage.value.clear()
        saleTotal.value = 0
      } else {
        toast.warning(result.msg)
      }
    } else {
      toast.warning('Corrija los campos inválidos para proceder con la compra')
    }
  }
</script>

<template>
  <div class="w-full flex items-center justify-between min-h-full">

    <div class="rounded-xl bg-gray-800 overflow-hidden p-3 flex flex-col w-2xs lg:flex-row lg:w-2xl lg:items-center lg:justify-between">
      <AppInputField v-model="searchString" type="text" id="searchBar" name="searchBar" placeholder="Escribe el código o nombre del producto" :required="true"/>
      <div class="ml-5">
        <Button text="Buscar" :on-click="searchProduct" buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white" icon-class="pi pi-search"/>
      </div>
    </div>

    <Button text="Corte de caja"
      :on-click="() => isCutVisible = true"
      buttonClass="bg-orange-600 hover:bg-orange-700 text-white"
      icon-class="pi pi-briefcase"
    />
  </div>

  <PopUp v-if="isCutVisible" :onClosed="closeCut" container-class="max-w-md">
    <GenerateCutForm />
  </PopUp>

  <div class="flex flex-row gap-10 w-full h-full mt-10">
    <div class="w-full h-full">
      <StageList :products="productsInStage" @subtotal-changed="updateSaleTotal"/>
    </div>

    <SaleSummary v-if="productsInStage.size > 0" @sale-confirmed="confirmSale" :total="saleTotal"/>
  </div>


  <PopUp v-if="isSearchResultVisible" :onClosed="closeSearchResult" container-class="max-w-4xl">

    <div v-for="product in searchResults" class="mx-auto w-full mt-3" :key="product.id">
      <div class="flex flex-row p-2 bg-white border border-gray-500 rounded-xl overflow-hidden items-center justify-between">
        <div class="flex flex-row gap-2 overflow-hidden items-center justify-start">
          <p class="text-md font-bold">{{ product.name }}:</p>
          <p class="text-sm text-gray-600">{{ product.description }}</p>
        </div>
        <SelectProductButton :id="product.id" @selected="addProductToStage"/>
      </div>
    </div>

  </PopUp>
</template>
