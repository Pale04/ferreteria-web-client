<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import Button from '@/components/Button.vue';
  import AppInputField from '@/components/AppInputField.vue';
  import { emailRegexPattern } from '@/utils/constants';
  import { getProvider } from '@/repositories/ProvidersRepository';
  import { useToast } from 'vue-toastification';

  const toast = useToast()

  const props = defineProps({
    onFormSent: Function,
    title: String,
    sendButtonText: String,
    providerId: {
      type: Number,
      default: 0
    }
  })

  const rfc = ref('')
  const name = ref('')
  const phone = ref('')
  const email = ref('')
  const address = ref('')

  const rfcIsValid = ref(true)
  const nameIsValid = ref(true)
  const phoneIsValid = ref(true)
  const emailIsValid = ref(true)
  const addressIsValid = ref(true)

  const errors = new Map()

  async function sendForm() {
    validateForm()
    if (rfcIsValid.value && nameIsValid.value && phoneIsValid.value && emailIsValid.value && addressIsValid.value) {
      const provider = {
        id: props.providerId,
        rfc: rfc.value,
        name: name.value,
        phone: phone.value,
        email: email.value,
        address: address.value
      }

      props.onFormSent(provider)
    }
  }

  function validateForm() {
    rfcIsValid.value = rfc.value.match(/^[A-Za-z0-9]{12,13}$/g)
    nameIsValid.value = name.value.match(/^.{1,255}$/g)
    phoneIsValid.value = phone.value.match(/^\d{10}$/g)
    emailIsValid.value = email.value.match(emailRegexPattern)
    addressIsValid.value = address.value.match(/^.{0,}$/g)

    if(rfcIsValid.value) {
      errors.delete('rfc')
    } else {
      errors.set('rfc','Proporcione un RFC válido por favor.')
    }

    if(name.value) {
      errors.delete('name')
    } else {
      errors.set('name','Proporcione el nombre por favor.')
    }

    if(phoneIsValid.value) {
      errors.delete('phone')
    } else {
      errors.set('phone','Proporcione un número de contacto válido por favor.')
    }

    if(emailIsValid.value) {
      errors.delete('email')
    } else {
      errors.set('email','Proporcione un correo electrónico válido por favor.')
    }

    if(addressIsValid.value) {
      errors.delete('address')
    } else {
      errors.set('address','Proporcione la dirección de manera más corta')
    }
  }

  onMounted(async () => {
    if (props.providerId > 0) {
      const result = await getProvider(props.providerId)
      if (result.success) {
        rfc.value = result.data.rfc
        name.value = result.data.name
        phone.value = result.data.phone
        email.value = result.data.email
        address.value = result.data.address ?? ''
      } else {
        toast.warning(result.msg)
      }
    }
  })
</script>

<template>
  <div class="text-center">
    <p class="mb-3 text-2xl font-semibold leading-5 text-slate-900 py-5">
      {{ title }}
    </p>
  </div>

  <form novalidate>

    <div class="mb-4">
      <AppInputField
        label="RFC"
        type="text"
        id="rfc"
        name="rfc"
        placeholder="XXXX000000X00"
        :required="true"
        v-model="rfc"
      />
      <span v-if="!rfcIsValid" class="text-sm text-red-600">{{ errors.get('rfc') }}</span>
    </div>

    <div class="mb-4">
      <AppInputField
        label="Nombre del proveedor"
        type="text"
        id="name"
        name="name"
        placeholder="Ej. Truper"
        :required="true"
        v-model="name"
      />
      <span v-if="!nameIsValid" class="text-sm text-red-600">{{ errors.get('name') }}</span>
    </div>

    <div class="mb-4">
      <AppInputField
        label="Teléfono"
        type="text"
        id="phone"
        name="phone"
        placeholder="Ej. 2201020304"
        :required="true"
        v-model="phone"
        text=""
      />
      <span v-if="!phoneIsValid" class="text-sm text-red-600">{{ errors.get('phone') }}</span>
    </div>

    <div class="mb-4">
      <AppInputField
        label="Correo electrónico"
        type="email"
        id="email"
        name="email"
        placeholder="Ej. proveedor@empresa.com"
        :required="true"
        v-model="email"
        text=""
      />
      <span v-if="!emailIsValid" class="text-sm text-red-600">{{ errors.get('email') }}</span>
    </div>

    <div class="mb-4">
      <AppInputField
        label="Dirección Fiscal"
        type="text"
        id="address"
        name="address"
        placeholder="Ej. Emiliano Zapata 19, Col. Centro, CP. 91000, Xalapa, Ver., México"
        :required="true"
        v-model="address"
        text=""
      />
      <span v-if="!addressIsValid" class="text-sm text-red-600">{{ errors.get('address') }}</span>
    </div>

    <div class="mt-10">
      <Button :text="sendButtonText" :on-click="sendForm" buttonClass="w-full bg-indigo-600 hover:bg-indigo-700 text-white"/>
    </div>

  </form>
</template>
