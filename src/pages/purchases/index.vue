<script setup>
import Button from "@/components/Button.vue";
import AppInputField from "@/components/AppInputField.vue";
import SelectProductButton from "@/pages/pos/SelectProductButton.vue";
import StageList from "@/pages/purchases/StageList.vue";
import PopUp from "@/components/PopUp.vue";

import { ref } from "vue";
import { getProductsById, getProductsBySearchString } from "@/repositories/ProductRepository";
import { useToast } from "vue-toastification";
import { useSessionStore } from "@/stores/session";

const searchString = ref("");
const productsInStage = ref(new Map());
const isSearchResultVisible = ref(false);
const searchResults = ref([]);

const session = useSessionStore();
const toast = useToast();

async function searchProduct() {
  if (searchString.value != "") {
    const result = await getProductsBySearchString(searchString.value);

    if (result.success) {
      searchResults.value = result.data;
      isSearchResultVisible.value = true;
    } else {
      toast.warning(result.msg);
    }
  }
}

function closeSearchResult() {
  isSearchResultVisible.value = false;
}

async function addProductToStage(id) {
  const result = await getProductsById(id);

  if (!result.success) {
    toast.info(result.msg);
  } else {
    let selectedProduct = result.data;
    if (productsInStage.value.has(id)) {
      const oldProduct = productsInStage.value.get(id);
      selectedProduct.quantity = oldProduct.quantity;
      selectedProduct.isValid = oldProduct.isValid;
    } else {
      selectedProduct.quantity = 1;
      selectedProduct.isValid = true;
    }
    productsInStage.value.set(id, selectedProduct);
    isSearchResultVisible.value = false;
  }
}

async function confirmPurchase() {
  const productsInStageAsIterator = productsInStage.value.values();

  let stageIsValid = true;
  let i = 0;
  while (i < productsInStage.value.size && stageIsValid) {
    stageIsValid = productsInStageAsIterator.next().value.isValid ?? true;
    i++;
  }

  if (stageIsValid) {
    const purchasedProducts = [];
    for (const product of productsInStage.value.values()) {
      purchasedProducts.push({
        id: product.id,
        quantity: product.quantity,
      });
    }

    const purchase = {
      providerId: 0, //TODO: Aqui cambia el id del proveedor que elijan
      employeeId: session.user.id,
      products: purchasedProducts,
    };

    console.log(purchase);

    //TODO: Aqui haces la llamada y haces un if como el siguiente:
    /*if (result.success) {
      toast.info("La compra se ha realizado exitosamente");
      productsInStage.value.clear(); //Esto es importante
    } else {
      toast.warning("no se pudo");
    }*/
  } else {
    toast.warning("Corrija los campos inválidos para proceder con la compra");
  }
}
</script>

<template>
  <div class="w-full flex items-center justify-between min-h-full">
    <div
      class="rounded-xl bg-green-800 overflow-hidden p-3 flex flex-col w-2xs lg:flex-row lg:w-2xl lg:items-center lg:justify-between"
    >
      <AppInputField
        v-model="searchString"
        type="text"
        id="searchBar"
        name="searchBar"
        placeholder="Escribe el código o nombre del producto"
        :required="true"
      />
      <div class="ml-5">
        <Button
          text="Buscar"
          :on-click="searchProduct"
          buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white"
          icon-class="pi pi-search"
        />
      </div>
    </div>
  </div>

  <div class="flex flex-row justify-between my-5">
    <h2>Aqui se elige el proveedor</h2>
    <Button
      v-if="productsInStage.size > 0"
      text="Confirmar compra"
      @click.prevent="confirmPurchase"
      button-class="bg-indigo-600 hover:bg-indigo-700 text-white"
      icon-class="pi pi-shopping-cart"
    />
  </div>

  <div class="flex flex-row gap-10 w-full h-full mt-10">
    <div class="w-full h-full">
      <StageList :products="productsInStage" />
    </div>
  </div>

  <PopUp v-if="isSearchResultVisible" :onClosed="closeSearchResult" container-class="max-w-4xl">
    <div v-for="product in searchResults" class="mx-auto w-full mt-3" :key="product.id">
      <div
        class="flex flex-row p-2 bg-white border border-gray-500 rounded-xl overflow-hidden items-center justify-between"
      >
        <div class="flex flex-row gap-2 overflow-hidden items-center justify-start">
          <p class="text-md font-bold">{{ product.name }}:</p>
          <p class="text-sm text-gray-600">{{ product.description }}</p>
        </div>
        <SelectProductButton :id="product.id" @selected="addProductToStage" />
      </div>
    </div>
  </PopUp>
</template>
