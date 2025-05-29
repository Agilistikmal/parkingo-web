<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader';
import { Field, Form } from 'vee-validate';
import type { VNodeRef } from 'vue';
import { UpdateParkingRequest, type Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';
import { slugify } from '~/lib/utils/slugify';

const slug = useRoute().params.slug as string;
const showDevices = ref(false);
const showMetadataEditor = ref(false);
const showLayoutEditor = ref(false);

const autoComplete = ref<VNodeRef | null>(null)!

const selectedAddress = ref({
  name: '',
  slug: '',
  address: '',
  latitude: 0,
  longitude: 0,
})

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

const { data, status, error } = await useFetch<Response<Parking>>(`/v1/parkings/slug/${slug}`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
  key: slug,
  server: false
});

const parking = computed(() => data.value?.data);
const parkingId = computed(() => parking.value?.id || null);

// Form data for metadata editing
const metadataForm = computed(() => ({
  name: parking.value?.name || '',
  slug: parking.value?.slug || '',
  address: parking.value?.address || '',
  latitude: parking.value?.latitude || 0,
  longitude: parking.value?.longitude || 0,
  default_fee: parking.value?.default_fee || 0,
}));

// Listen to selectedAddress changes
watch(selectedAddress, () => {
  metadataForm.value.address = selectedAddress.value.address;
  metadataForm.value.latitude = selectedAddress.value.latitude;
  metadataForm.value.longitude = selectedAddress.value.longitude;
});

// Handle metadata edit
async function handleEditMetadata() {
  try {
    if (!parkingId.value) return;
    await $fetch(`/v1/parkings/${parkingId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        Authorization: "Bearer " + useAuthStore().token,
      },
      method: "PATCH",
      body: metadataForm.value
    });

    // Refresh data
    await refreshNuxtData();
    showMetadataEditor.value = false;
  } catch (e) {
    console.error("Failed to update parking metadata", e);
  }
}

// Handle layout edit
async function handleEditLayout() {
  try {
    if (!parkingId.value) return;

    await $fetch(`/v1/parkings/${parkingId.value}/layout`, {
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        Authorization: "Bearer " + useAuthStore().token,
      },
      method: "PUT",
      body: {
        layout: parking.value?.layout
      }
    });

    // Refresh data
    await refreshNuxtData();
    showLayoutEditor.value = false;
  } catch (e) {
    console.error("Failed to update parking layout", e);
  }
}

// Simpler approach for deleting
async function handleDeleteParking() {
  try {
    // Only proceed if we have an ID
    if (!parkingId.value) return;

    await $fetch(`/v1/parkings/${parkingId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      headers: {
        Authorization: "Bearer " + useAuthStore().token,
      },
      method: "DELETE"
    });

    // Navigate away on success
    useRouter().push("/d/parkings");
  } catch (e) {
    console.error("Failed to delete parking", e);
  }
}
</script>

<template>
  <NuxtLayout name="dashboard">
    <div>
      <h3>Area Parkir {{ parking?.name }}</h3>
      <p>Menampilkan daftar area parkir <span class="text-brand">{{ slug }}</span></p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2" />
    </div>

    <LoadingBar v-if="status == 'pending'" />
    <div v-else-if="error">
      <p class="text-red-500">Gagal memuat data area parkir: {{ error.data?.message }}</p>
    </div>

    <div v-else class="space-y-4">
      <!-- Toggle Controls -->
      <div class="flex items-center gap-4 flex-wrap">
        <Toggle v-model="showLayoutEditor" label="Edit Layout" />
      </div>

      <!-- Camera Feed -->
      <CameraFeedViewer :show-devices="showDevices" />

      <!-- Metadata Editor -->
      <Form v-if="!showLayoutEditor" class="p-5 rounded-3xl bg-white/10 w-full max-w-xl" @submit="handleEditMetadata">
        <div class="text-center">
          <h4>Ubah Informasi Parkiran</h4>
        </div>
        <div class="space-y-2" v-auto-animate>
          <label for="address">
            <span>Alamat</span>
            <textarea id="address" name="address" type="text" placeholder="Jl. ABC No. 123, Yogyakarta"
              ref="autoComplete" v-model="metadataForm.address" class="w-full"></textarea>
            <br>
            <ErrorMessage name="address" class="text-sm italic text-red-200" />
          </label>

          <!-- Autofill -->
          <label for="name">
            <span>Nama</span>
            <Field id="name" name="name" type="text" placeholder="Parkir A UTY 1" :rules="UpdateParkingRequest.name"
              v-model="metadataForm.name" class="w-full" />
            <br>
            <ErrorMessage name="name" class="text-sm italic text-red-200" />
          </label>
          <label for="slug">
            <span>Slug</span>
            <Field id="slug" name="slug" type="text" placeholder="parkir-a-uty-1" :rules="UpdateParkingRequest.slug"
              v-model="metadataForm.slug" class="w-full" />
            <br>
            <ErrorMessage name="slug" class="text-sm italic text-red-200" />
          </label>
          <div class="flex gap-2">
            <label for="latitude">
              <span>Latitude</span>
              <Field id="latitude" name="latitude" type="text" :rules="UpdateParkingRequest.latitude"
                v-model="metadataForm.latitude" class="w-full" />
              <br>
              <ErrorMessage name="latitude" class="text-sm italic text-red-200" />
            </label>
            <label for="longitude">
              <span>Longitude</span>
              <Field id="longitude" name="longitude" type="text" :rules="UpdateParkingRequest.longitude"
                v-model="metadataForm.longitude" class="w-full" />
              <br>
              <ErrorMessage name="longitude" class="text-sm italic text-red-200" />
            </label>
          </div>
          <!-- End Autofill -->

          <label for="default_fee">
            <p>Tarif Parkir Standar</p>
            <span class="text-xs text-white/70">Tarif ini akan diterapkan ke semua slot parkir, tarif parkir masing
              masing slot parkir dapat diubah nanti.</span>
            <Field id="default_fee" name="default_fee" type="number" placeholder="10000"
              :rules="UpdateParkingRequest.default_fee" v-model="metadataForm.default_fee" class="w-full" />
            <br>
            <ErrorMessage name="default_fee" class="text-sm italic text-red-200" />
          </label>
        </div>

        <div class="flex gap-2 mt-5">
          <Button class="flex-1">
            <template #text>Simpan</template>
          </Button>
          <Button class="flex-1" type="button" bg="bg-red-500" color="text-white" @click="handleDeleteParking">
            <template #text>Hapus</template>
          </Button>
        </div>
      </Form>

      <!-- Layout Editor -->
      <div v-if="showLayoutEditor" class="p-5 rounded-3xl bg-white/10 w-full max-w-xl">
        <div class="text-center">
          <h4>Ubah Layout Parkiran</h4>
        </div>
        <div class="w-max mx-auto mt-5">
          <ParkingGridEditor :model-value="parking?.layout || []"
            @update:model-value="newVal => parking && (parking.layout = newVal)" />
        </div>
        <Button class="w-full mt-5" @click="handleEditLayout">
          <template #text>Simpan Layout</template>
        </Button>
      </div>
    </div>
  </NuxtLayout>
</template>
