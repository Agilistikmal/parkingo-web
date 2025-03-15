<script setup lang="ts">
import { NuxtLayout } from '#components';
import { Icon } from '@iconify/vue'
import type { Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { CreateBookingRequest, UpdateBookingRequest } from '~/lib/types/booking';

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
        <div v-auto-animate>
          <div v-if="openBookingMenu" class="mt-5">
            <Form class="p-5 rounded-3xl bg-white/10 w-full max-w-xl">
              <div class="text-center">
                <h2>Form Booking</h2>
                <h4>Slot Parkir {{ selected }}</h4>
              </div>
              <label for="plate_number">
                <h4>Plat Nomor Kendaraan</h4>
                <Field id="plate_number" name="plate_number" type="text" placeholder="KB 4 GIL"
                  :rules="UpdateBookingRequest.plate_number" class="w-full" />
                <br>
                <ErrorMessage name="plate_number" class="text-sm italic text-red-200" />
              </label>
              <div>
                <h4>Rentang Waktu</h4>
                <div class="grid grid-cols-2 gap-2 w-full">
                  <label for="start_at">
                    <h5>Mulai</h5>
                    <Field id="start_at" name="start_at" type="datetime-local" placeholder="user@email.com"
                      :rules="UpdateBookingRequest.start_at" />
                    <br>
                    <ErrorMessage name="start_at" class="text-sm italic text-red-200" />
                  </label>
                  <label for="end_at">
                    <h5>Selesai</h5>
                    <Field id="end_at" name="end_at" type="datetime-local" placeholder="user@email.com"
                      :rules="UpdateBookingRequest.end_at" />
                    <br>
                    <ErrorMessage name="end_at" class="text-sm italic text-red-200" />
                  </label>
                </div>
              </div>
              <Button class="w-full mt-5">
                <template #text>Booking Sekarang</template>
              </Button>
            </Form>
          </div>
        </div>
        <!-- End Booking Form -->
      </div>
    </div>

  </NuxtLayout>
</template>