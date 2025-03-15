<script setup lang="ts">
import { NuxtLayout } from '#components';
import { Icon } from '@iconify/vue'
import type { Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';

useSeoMeta({
  title: "Parkingo - UTY 1",
  ogTitle: "Parkingo - UTY 1",
  twitterTitle: "Parkingo - UTY 1",

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

const route = useRoute()

const parking = ref<Parking | null>()
const res: Response<Parking> = await $fetch(`/v1/parkings/slug/${route.params.slug}`, {
  baseURL: useRuntimeConfig().public.apiBase
})
parking.value = res.data

const config = useRuntimeConfig()

const user = ref()

const authStore = useAuthStore()
if (authStore.isAuthenticated) {
  user.value = await $fetch("/v1/users/me", {
    baseURL: config.public.apiBase,
    headers: {
      "Authorization": "Bearer " + useCookie("token").value
    }
  })
}

const selected = ref();
const openBookingMenu = ref(false)

// [
//   ["EMPTY", "P", "P", "DOOR", "P", "P", "P", "P", "EMPTY"],
//   ["EMPTY", "ROAD", "ROAD", "ROAD", "ROAD", "ROAD", "ROAD", "ROAD", "EXIT"],
//   ["EMPTY", "ROAD", "P", "P", "ROAD", "P", "P", "ROAD", "P"],
//   ["IN", "ROAD", "ROAD", "ROAD", "ROAD", "P", "P", "ROAD", "P"],
//   ["EMPTY", "P", "P", "P", "ROAD", "ROAD", "ROAD", "ROAD", "P"],
// ]

</script>

<template>
  <NuxtLayout name="main">
    <div class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-xl mx-auto min-h-screen">
      <div v-if="parking">
        <!-- Hero -->
        <div>
          <h4 class="font-semibold">{{ parking.name }}</h4>
          <p class="text-white/70">
            <Icon icon="mdi:location" width="24" height="24" class="inline" />
            {{ parking.address }}
          </p>
          <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
        </div>
        <!-- End Hero -->

        <div v-auto-animate>

          <!-- Parking Layout -->
          <div v-if="!openBookingMenu" class="mt-5 flex flex-col bg-black w-full overflow-x-scroll">
            <div v-for="(row, indexRow) in parking.layout" class="flex">
              <div v-for="(col, indexCol) in row">
                <button v-if="col == `P`"
                  :class="`block relative w-16 aspect-square ${selected == `${indexRow}-${indexCol}` ? `bg-accent/70` : `bg-white/10`} p-1 cursor-pointer`"
                  @click="selected = `${indexRow}-${indexCol}`">
                  <div
                    class="border-4 border-white/25 text-white/70 border-dotted w-full h-full mx-auto text-center flex items-center gap-2">
                    <div class="mx-auto">
                      <Icon icon="mdi:parking" width="24" height="24" />
                      <div class="text-xs text-white/50 absolute left-0 bottom-2 mx-auto w-full">
                        <span>{{ indexRow }}-{{ indexCol }}</span>
                      </div>
                    </div>
                  </div>
                </button>
                <div v-if="col == `EMPTY`"
                  :class="`w-16 aspect-square text-center bg-transparent flex items-center gap-2`">
                </div>
                <div v-if="col == `ROAD`" :class="`w-16 aspect-square text-center bg-white/10 flex items-center gap-2`">
                </div>
                <div v-if="col == `IN`"
                  :class="`w-16 aspect-square text-center bg-green-200 text-green-500 font-semibold flex items-center gap-2`">
                  <div class="mx-auto">
                    {{ col }}
                  </div>
                </div>
                <div v-if="col == `DOOR`"
                  :class="`w-16 aspect-square text-center bg-green-500 text-green-200 font-semibold flex items-center gap-2`">
                  <div class="mx-auto">
                    {{ col }}
                  </div>
                </div>
                <div v-if="col == `EXIT`"
                  :class="`w-16 aspect-square text-center bg-red-200 text-red-500 font-semibold flex items-center gap-2`">
                  <div class="mx-auto">
                    {{ col }}
                  </div>
                </div>
              </div>
            </div>

            <div class="my-5">
              <div class="flex gap-8 text-sm">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 bg-white/10"></div>
                  <p>Available</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 bg-accent"></div>
                  <p>Selected</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 bg-brand"></div>
                  <p>Booked</p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 bg-red-500"></div>
                  <p class="text-nowrap">Not Available</p>
                </div>
              </div>
            </div>
          </div>
          <!-- End Parking Layout -->
        </div>

        <!-- Booking Button -->
        <div v-auto-animate>
          <Button v-if="selected" @click="openBookingMenu = !openBookingMenu">
            <template #icon>
              <Icon v-if="!openBookingMenu" icon="solar:alt-arrow-right-bold" width="24" height="24" />
              <Icon v-else icon="solar:alt-arrow-left-bold" width="24" height="24" />
            </template>
            <template #text>
              <div v-auto-animate>
                <p v-if="!openBookingMenu">Lanjut Booking</p>
                <p v-else>Kembali</p>
              </div>
            </template>
          </Button>
        </div>
        <!-- End Booking Button -->

        <!-- Booking Form -->
        <div v-if="openBookingMenu" class="mt-5">
          <div class="flex gap-5">
            <div class="w-1/2">
              <h4 class="font-semibold">Detail Parkir</h4>
              <p class="text-white">Area Parkir: {{ parking.name }}</p>
              <p class="text-white">Slot Parkir: {{ selected }}</p>
            </div>
          </div>
        </div>

        <!-- End Booking Form -->
      </div>
    </div>

  </NuxtLayout>
</template>