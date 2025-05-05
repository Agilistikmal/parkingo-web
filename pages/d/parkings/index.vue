<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';

const parkings = ref<Parking[] | null>()
onMounted(async () => {
  const res: Response<Parking[]> = await $fetch('/v1/parkings', {
    baseURL: useRuntimeConfig().public.apiBase
  })
  parkings.value = res.data
})
</script>

<template>
  <NuxtLayout name="dashboard">
    <div>
      <h3>Area Parkir Saya</h3>
      <p>Menampilkan daftar area parkir yang dimiliki</p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 " />
    </div>

    <div class="flex items-center gap-2 w-full">
      <div class="px-5 py-1 rounded-lg bg-white/10 w-max my-2 mx-auto md:mx-0 flex-grow" />
      <NuxtLink href="/d/parkings/create">
        <Button bg="bg-white/10" color="text-white">
          <template #icon>
            <Icon icon="mdi:plus" width="24" height="24" />
          </template>
          <template #text>Tambah Area Parkir</template>
        </Button>
      </NuxtLink>
    </div>

    <!-- Places -->
    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <div class="p-5 rounded-3xl bg-white/5" v-for="parking in parkings">
        <iframe :src="`https://maps.google.com/maps?q=${parking.latitude},${parking.longitude}&z=15&output=embed`"
          style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          class="w-full rounded-xl"></iframe>
        <h4 class="font-semibold mt-2">{{ parking.name }}</h4>
        <p class="text-white/70">
          {{ parking.address }}
        </p>
        <NuxtLink :href="`/d/parkings/${parking.slug}`" class="mt-5 block">
          <Button class="w-full">
            <template #text>Edit Parkiran</template>
          </Button>
        </NuxtLink>
        <NuxtLink :href="`/p/${parking.slug}`" class="mt-2 block">
          <Button class="w-full" bg="bg-white/10" color="text-white">
            <template #icon>
              <Icon icon="mdi:external-link" width="24" height="24" />
            </template>
            <template #text>Lihat Parkiran</template>
          </Button>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
