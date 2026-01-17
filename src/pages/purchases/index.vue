<script setup>
import Button from "@/components/Button.vue";
import AppInputField from "@/components/AppInputField.vue";
import SelectProductButton from "@/pages/pos/SelectProductButton.vue";
import StageList from "@/pages/purchases/StageList.vue";
import PopUp from "@/components/PopUp.vue";

import { ref } from "vue";
import { getProductsById, getProductsBySearchString } from "@/repositories/ProductRepository";
import { getAllProviders } from "@/repositories/ProvidersRepository";
import {addPurchase} from "@/repositories/PurchasesRepository";
import { useToast } from "vue-toastification";
import { useSessionStore } from "@/stores/session";

const searchString = ref("");
const productsInStage = ref(new Map());
const isSearchResultVisible = ref(false);
const searchResults = ref([]);
const providers = ref([]);
const selectedProviderId = ref(null);

const session = useSessionStore();
const toast = useToast();

async function loadProviders() {
  const result = await getAllProviders();
  if (result.success) {
    providers.value = result.data;
  } else {
    toast.warning(result.msg);
  }
}

loadProviders();


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
  if (!selectedProviderId.value) {
    toast.warning("Seleccione un proveedor");
    return;
  }

  const productsInStageAsIterator = productsInStage.value.values();

  let stageIsValid = true;
  let i = 0;
  while (i < productsInStage.value.size && stageIsValid) {
    stageIsValid = productsInStageAsIterator.next().value.isValid ?? true;
    i++;
  }

  if (!stageIsValid) {
    toast.warning("Corrija los campos inválidos para proceder con la compra");
    return;
  }

  const purchasedProducts = [];
  for (const product of productsInStage.value.values()) {
    purchasedProducts.push({
      id: product.id,
      quantity: product.quantity,
    });
  }

  const purchase = {
    providerId: selectedProviderId.value,
    employeeId: session.user.id,
    products: purchasedProducts,
  };

  const result = await addPurchase(purchase);

  if (result.success) {
    toast.info(result.msg);
    productsInStage.value.clear();
    selectedProviderId.value = null;
  } else {
    toast.warning(result.msg);
  }
}

</script>

<template>
  <div
    class="w-full bg-green-800 rounded-xl p-4 flex flex-col gap-4
          lg:flex-row lg:items-center lg:justify-between"
  >
    <div class="flex flex-1 gap-3 items-center">
      <AppInputField
        v-model="searchString"
        type="text"
        id="searchBar"
        name="searchBar"
        placeholder="Escribe el código o nombre del producto"
        :required="true"
        class="flex-1"
      />

      <Button
        text="Buscar"
        :on-click="searchProduct"
        buttonClass="bg-indigo-600 hover:bg-indigo-700 text-white"
        icon-class="pi pi-search"
      />
    </div>

    <!-- Proveedor + Confirmar -->
    <div class="flex gap-4 items-center">
      <div class="flex flex-col">
        <label class="text-sm font-semibold text-white mb-1">
          Proveedor
        </label>
        <select
          v-model="selectedProviderId"
          class="rounded-lg px-3 py-2 text-sm
                border border-gray-300 focus:outline-none
                focus:ring-2 focus:ring-indigo-500"
        >
          <option disabled value="">
            Seleccione un proveedor
          </option>
          <option
            v-for="provider in providers"
            :key="provider.id"
            :value="provider.id"
          >
            {{ provider.name }}
          </option>
        </select>
      </div>

      <Button
        v-if="productsInStage.size > 0"
        text="Confirmar compra"
        @click.prevent="confirmPurchase"
        button-class="bg-indigo-600 hover:bg-indigo-700 text-white"
        icon-class="pi pi-shopping-cart"
      />
    </div>
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
