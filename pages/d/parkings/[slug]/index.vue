<script setup lang="ts">
import type { Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';


const slug = useRoute().params.slug as string;

const parkingFetch = useFetch<Response<Parking>>(`/v1/parkings/slug/${slug}`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
  key: slug,
});
const parking = computed(() => parkingFetch.data.value?.data);

const layoutRef = ref(parking.value?.layout);

watch(parking, (newVal) => {
  if (newVal?.layout) {
    layoutRef.value = newVal.layout;
  }
});

const parkingPostFetch = useFetch<Response<Parking>>(`/v1/parkings`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
  method: "POST",
  immediate: false,
});

async function handleEditParking() {
  await parkingPostFetch.execute()
}

const parkingDeleteFetch = useFetch<Response<Parking>>(`/v1/parkings/${parking.value?.id}`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
  method: "DELETE",
  immediate: false,
  server: false
});

async function handleDeleteParking() {
  await parkingDeleteFetch.execute()

  if (parkingDeleteFetch.status.value === "success") {
    useRouter().push("/d/parkings");
  }
}
</script>

<template>
  <NuxtLayout name="dashboard">
    <div>
      <h3>Area Parkir {{ parking?.name }}</h3>
      <p>Menampilkan daftar area parkir <span class="text-brand">{{ slug }}</span></p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 " />
    </div>

    <LoadingBar v-if="parkingFetch.status.value == 'pending'" />
    <div v-else-if="parkingFetch.status.value == 'error'">
      <p class="text-red-500">Gagal memuat data area parkir: {{ parkingFetch.error.value?.data.message }}</p>
    </div>

    <div v-if="parkingFetch.status.value == 'success'">
      <Form class="p-5 rounded-3xl bg-white/10 w-full max-w-xl" @submit="handleEditParking">
        <div class="text-center">
          <h4>Ubah Parkiran</h4>
        </div>
        <div class="space-y-2" v-auto-animate>
          <div class="w-max mx-auto mt-5">
            <ParkingGridEditor ref="layoutRef" :model-value="parking?.layout" />
          </div>
        </div>

        <div v-if="parkingPostFetch.error">{{ parkingPostFetch.error.value?.data.message }}</div>
        <Button class="w-full mt-5">
          <template #text v-if="parkingPostFetch.status.value == 'pending'">Loading...</template>
          <template #text v-else>Simpan</template>
        </Button>
        <Button class="w-full mt-2" type="reset" bg="bg-red-500" color="text-white" @click="handleDeleteParking">
          <template #text v-if="parkingDeleteFetch.status.value == 'pending'">Loading...</template>
          <template #text v-else>Hapus</template>
        </Button>
      </Form>
    </div>
  </NuxtLayout>
</template>
