<script setup lang="ts">
import type { Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';

const slug = useRoute().params.slug as string;
const showDevices = ref(false);

const { data, error } = await useFetch<Response<Parking>>(`/v1/parkings/slug/${slug}`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
  key: slug,
  server: false
});

const parking = computed(() => data.value?.data);
const parkingId = computed(() => parking.value?.id || null);

// Simpler approach for editing
async function handleEditParking() {
  // Implement edit logic here
  console.log("Edit parking", parkingId.value);
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

    <LoadingBar v-if="!data" />
    <div v-else-if="error">
      <p class="text-red-500">Gagal memuat data area parkir: {{ error.data?.message }}</p>
    </div>

    <div v-else>
      <div class="flex items-center mb-4">
        <Toggle v-model="showDevices" label="Show Live Cameras" />
      </div>
      <CameraFeedViewer :show-devices="showDevices" />


      <Form class="p-5 rounded-3xl bg-white/10 w-full max-w-xl" @submit="handleEditParking">
        <div class="text-center">
          <h4>Ubah Parkiran</h4>
        </div>
        <div class="space-y-2" v-auto-animate>
          <div class="w-max mx-auto mt-5">
            <ParkingGridEditor :model-value="parking?.layout" />
          </div>
        </div>

        <Button class="w-full mt-5">
          <template #text>Simpan</template>
        </Button>
        <Button class="w-full mt-2" type="reset" bg="bg-red-500" color="text-white" @click="handleDeleteParking">
          <template #text>Hapus</template>
        </Button>
      </Form>
    </div>
  </NuxtLayout>
</template>
