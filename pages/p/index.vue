<script setup lang="ts">
import { NuxtLayout } from '#components';
import type { Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';

useSeoMeta({
  title: "Parkingo - Places",
  ogTitle: "Parkingo - Places",
  twitterTitle: "Parkingo - Places",

  ogUrl: "https:/parkingo.agil.zip",
  twitterSite: "https:/parkingo.agil.zip",

  description: "Solusi pintar parkir modern",
  ogDescription: "Solusi pintar parkir modern",
  twitterDescription: "Solusi pintar parkir modern",

  ogImage: "https:/parkingo.agil.zip/assets/logo.png",
  twitterImage: "https:/parkingo.agil.zip/assets/logo.png",
  twitterCard: "summary_large_image"
}, {
  mode: "server"
})

const searchParams = useRoute().query;
const userLocation = ref({
  latitude: 0,
  longitude: 0,
})

if (import.meta.client) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('position')
      console.log(position)
      userLocation.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
    }, (error) => {
      console.error('error getting user location', error)
    })
  } else {
    console.log('geolocation not supported')
  }
}

const filters = ref({
  search: String(searchParams.search ?? ''),
  user_latitude: userLocation.value.latitude,
  user_longitude: userLocation.value.longitude,
  radius: Number(searchParams.radius ?? 0),
  sort_by: String(searchParams.sortBy ?? 'created_at'),
  sort_order: String(searchParams.sortOrder ?? 'asc'),
})

const parkingsFetch = useFetch<Response<Parking[]>>('/v1/parkings', {
  baseURL: useRuntimeConfig().public.apiBase,
  query: filters.value,
  server: false
})
const parkings = computed(() => parkingsFetch.data.value?.data ?? []);
</script>

<template>
  <NuxtLayout name="main">
    <div class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-xl mx-auto min-h-screen">
      <!-- Hero -->
      <div>
        <h4 class="font-semibold">Area Parkir</h4>
        <p>Pilih tempat atau area parkir. <span class="text-white/70 text-xs"
            v-if="userLocation.latitude && userLocation.longitude">Lokasi anda
            ditemukan</span></p>
        <div class="px-5 py-1 rounded-lg bg-brand w-max my-2" />
      </div>

      <!-- Places -->
      <div class="flex items-center gap-2 flex-wrap">
        <div class="w-full md:w-max md:flex-1">
          <input class="w-full" type="text" v-model="filters.search" @change="parkingsFetch.refresh()"
            placeholder="Cari parkiran" />
        </div>
        <div class="flex items-center gap-2 w-full md:w-max">
          <select class="w-full" v-model="filters.sort_by" @change="parkingsFetch.refresh()">
            <option value="created_at">Terbaru</option>
            <option value="name">Nama</option>
          </select>
          <select class="w-full" v-model="filters.radius" @change="parkingsFetch.refresh()">
            <option value="0">Semua</option>
            <option value="1">1 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
          </select>
        </div>
      </div>
      <LoadingBar v-if="parkingsFetch.status.value == 'pending'" class="mt-5" />
      <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div class="p-5 rounded-3xl bg-white/5" v-for="parking in parkings">
          <iframe :src="`https://maps.google.com/maps?q=${parking.latitude},${parking.longitude}&z=15&output=embed`"
            style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            class="w-full rounded-xl"></iframe>
          <h4 class="font-semibold mt-2">{{ parking.name }}</h4>
          <p class="text-white/70">
            {{ parking.address }}
          </p>
          <NuxtLink :href="`/p/${parking.slug}`" class="mt-5 block">
            <Button class="w-full">
              <template #text>Lihat Parkiran</template>
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
