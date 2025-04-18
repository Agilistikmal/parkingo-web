<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader';
import { ErrorMessage, Field, Form } from 'vee-validate';
import type { VNodeRef } from 'vue';
import { CreateParkingRequest, type Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';
import { slugify } from '~/lib/utils/slugify';

const errors = ref();
const loading = ref(false);

const autoComplete = ref<VNodeRef | null>(null)!

const selectedAddress = ref({
  name: '',
  slug: '',
  address: '',
  latitude: 0,
  longitude: 0,
})

const layoutRef = ref();

onMounted(async () => {
  await nextTick()

  if (!autoComplete.value) {
    console.warn('Input element belum siap')
    return
  }

  const loader = new Loader({
    apiKey: useRuntimeConfig().public.googleMapsApiKey,
    version: "weekly",
    libraries: ['places'],
  })

  const google = await loader.load()

  if (!google) {
    console.error('Google Maps API failed to load')
    return
  }


  const auto = new google.maps.places.Autocomplete(autoComplete.value, {
    types: ['geocode', 'establishment'],
    componentRestrictions: { country: 'id' },
  })

  auto.addListener('place_changed', () => {
    const place = auto.getPlace()

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();
    const name = place.name;
    const address = place.formatted_address;

    selectedAddress.value = {
      name,
      address,
      latitude,
      longitude,
      slug: slugify(name)
    }
  })
})

async function handleCreateForm(values: any) {
  loading.value = true
  try {
    const res: Response<Parking> = await $fetch("/v1/parkings", {
      baseURL: useRuntimeConfig().public.apiBase,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + useAuthStore().token,
      },
      body: {
        ...selectedAddress.value,
        default_fee: values.default_fee,
        layout: layoutRef.value.getLayout(),
      }
    })

    if (res.data) {
      await navigateTo(`/d/parkings/${res.data.slug}`)
    }
  } catch (err: any) {
    if (err.response?._data) {
      errors.value = err.response._data.errors
    } else {
      errors.value = err.message
    }
  }
  loading.value = false
};
</script>

<template>
  <NuxtLayout name="dashboard">
    <div>
      <h3>Tambah Area Parkir</h3>
      <p>Silahkan isi form dibawah ini untuk menambahkan area parkir baru</p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
    </div>

    <Form class="p-5 rounded-3xl bg-white/10 w-full max-w-xl" @submit="handleCreateForm">
      <div class="text-center">
        <h4>Tambah Parkiran</h4>
      </div>
      <div class="space-y-2" v-auto-animate>
        <label for="address">
          <span>Alamat</span>
          <textarea id="address" name="address" type="text" placeholder="Jl. ABC No. 123, Yogyakarta" ref="autoComplete"
            class="w-full"></textarea>
          <br>
          <ErrorMessage name="address" class="text-sm italic text-red-200" />
        </label>

        <!-- Autofill -->
        <label for="name" v-if="selectedAddress.name">
          <span>Nama</span>
          <Field id="name" name="name" type="text" placeholder="Parkir A UTY 1" :rules="CreateParkingRequest.name"
            v-model="selectedAddress.name" class="w-full" />
          <br>
          <ErrorMessage name="name" class="text-sm italic text-red-200" />
        </label>
        <label for="slug" v-if="selectedAddress.name">
          <span>Slug</span>
          <Field id="slug" name="slug" type="text" placeholder="parkir-a-uty-1" :rules="CreateParkingRequest.slug"
            v-model="selectedAddress.slug" class="w-full" />
          <br>
          <ErrorMessage name="slug" class="text-sm italic text-red-200" />
        </label>
        <div class="flex gap-2">
          <label for="latitude" v-if="selectedAddress.latitude">
            <span>Latitude</span>
            <Field id="latitude" name="latitude" type="text" :rules="CreateParkingRequest.latitude"
              v-model="selectedAddress.latitude" class="w-full" />
            <br>
            <ErrorMessage name="latitude" class="text-sm italic text-red-200" />
          </label>
          <label for="longitude" v-if="selectedAddress.latitude">
            <span>Longitude</span>
            <Field id="longitude" name="longitude" type="text" :rules="CreateParkingRequest.longitude"
              v-model="selectedAddress.longitude" class="w-full" />
            <br>
            <ErrorMessage name="longitude" class="text-sm italic text-red-200" />
          </label>
        </div>
        <!-- End Autofill -->

        <label for="default_fee" v-if="selectedAddress.name">
          <p>Tarif Parkir Standar</p>
          <span class="text-xs text-white/70">Tarif ini akan diterapkan ke semua slot parkir, tarif parkir masing
            masing slot parkir dapat diubah nanti.</span>
          <Field id="default_fee" name="default_fee" type="number" placeholder="10000"
            :rules="CreateParkingRequest.default_fee" class="w-full" />
          <br>
          <ErrorMessage name="default_fee" class="text-sm italic text-red-200" />
        </label>

        <div class="w-max mx-auto mt-5" v-if="selectedAddress.address">
          <ParkingGridEditor ref="layoutRef" />
        </div>
      </div>

      <div v-if="errors">{{ errors }}</div>
      <Button class="w-full mt-5">
        <template #text v-if="loading">Loading...</template>
        <template #text v-else>Simpan</template>
      </Button>
    </Form>
  </NuxtLayout>
</template>