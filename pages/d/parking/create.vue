<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader';
import { ErrorMessage, Field } from 'vee-validate';
import type { VNodeRef } from 'vue';
import { CreateParkingRequest } from '~/lib/types/parking';

const autoComplete = ref<VNodeRef | null>(null)!

onMounted(async () => {
  const loader = new Loader({
    apiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  })

  const google = await loader.load()

  if (autoComplete.value) {
    const auto = new google.maps.places.Autocomplete(autoComplete.value, {
      types: ['geocode'],
      componentRestrictions: { country: 'id' },
    })

    auto.addListener('place_changed', () => {
      const place = auto.getPlace()
      // Optional: log / autofill, dst.
      console.log('Selected place:', place)
    })
  }
})

const handleCreateForm = () => {
    // Add your form submission logic here
};
</script>

<template>
    <NuxtLayout name="dashboard">
        <div>
            <h3>Tambah Area Parkir</h3>
            <p>Silahkan isi form dibawah ini untuk menambahkan area parkir baru</p>
            <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
        </div>

        <!-- Create Form -->
        <Form class="p-5 rounded-3xl bg-white/10 w-full max-w-xl" @submit.prevent="handleCreateForm">
            <div class="text-center">
                <h4>Tambah Parkiran</h4>
            </div>
            <div class="space-y-2">
                <label for="name">
                    <span>Nama</span>
                    <Field id="name" name="name" type="text" placeholder="Parkir A UTY 1"
                        :rules="CreateParkingRequest.name" class="w-full" />
                    <br>
                    <ErrorMessage name="name" class="text-sm italic text-red-200" />
                </label>
                <label for="name">
                    <span>Slug</span>
                    <Field id="slug" name="slug" type="text" placeholder="parkir-a-uty-1"
                        :rules="CreateParkingRequest.slug" class="w-full" />
                    <br>
                    <ErrorMessage name="slug" class="text-sm italic text-red-200" />
                </label>
                <label for="address">
                    <span>Alamat</span>
                    <Field id="address" name="address" type="text" placeholder="Jl. ABC No. 123, Yogyakarta"
                        :rules="CreateParkingRequest.address" :ref="autoComplete" class="w-full" />
                    <br>
                    <ErrorMessage name="address" class="text-sm italic text-red-200" />
                </label>
                
            </div>
            <Button class="w-full mt-5">
                <template #text>Simpan</template>
            </Button>
        </Form>
        <!-- End Create Form -->

    </NuxtLayout>
</template>