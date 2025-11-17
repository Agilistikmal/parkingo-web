<script setup lang="ts">
import { NuxtLayout } from '#components';
import { Icon } from '@iconify/vue'
import type { Parking, ParkingSlot } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { CreateBookingRequest, type Booking } from '~/lib/types/booking';

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

const parkingFetch = await useFetch<Response<Parking>>(`/v1/parkings/slug/${useRoute().params.slug}`, {
  baseURL: useRuntimeConfig().public.apiBase,
  key: useRoute().params.slug as string,
})
if (import.meta.client) {
  setInterval(() => {
    parkingFetch.execute()
  }, 5000)
}

const parking = computed(() => parkingFetch.data.value?.data ?? null);

const slots = ref<{ [key: string]: ParkingSlot }>({})
watchEffect(() => {
  for (const slot of parking.value?.slots ?? []) {
    slots.value[`${slot.row}-${slot.col}`] = slot
  }
})

const selected = ref();
const openBookingMenu = ref(false)

function getDefaultTime() {
  const now = new Date()
  now.setHours(now.getHours() + 1)
  return now.toTimeString().slice(0, 5) // format "HH:mm"
}

const startTime = computed(() => getDefaultTime())
const totalHours = computed(() => 3)

const startAt = computed(() => {
  const today = new Date()
  const [hours, minutes] = startTime.value.split(':').map(Number)
  today.setHours(hours, minutes, 0, 0)
  return today.toISOString()
})

const endAt = computed(() => {
  const temp = new Date(startAt.value)
  temp.setHours(temp.getHours() + totalHours.value)
  return temp.toISOString()
})

const bookingReq = ref<any>()
const bookingPostFetch = await useFetch<Response<Booking>>(`/v1/bookings`, {
  baseURL: useRuntimeConfig().public.apiBase,
  method: "POST",
  headers: {
    "Authorization": "Bearer " + useAuthStore().token,
  },
  body: bookingReq,
  immediate: false,
  server: false
})
async function handleBooking(values: any) {
  bookingReq.value = {
    plate_number: values.plate_number,
    parking_id: parking.value?.id,
    slot_id: slots.value[selected.value].id,
    start_at: startAt,
    end_at: endAt,
  }

  await bookingPostFetch.execute()

  const booking = computed(() => bookingPostFetch.data.value?.data ?? null);

  if (bookingPostFetch.status.value == "success" && booking.value) {
    await navigateTo(booking.value.payment_link, { external: true, open: { target: "_blank" } })
    await navigateTo(`/b/${booking.value.payment_reference}`)
  }
}
</script>

<template>
  <NuxtLayout name="main">
    <div class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-xl mx-auto min-h-screen">
      <LoadingBar v-if="parkingFetch.status.value == 'pending' && parking == null" />
      <div v-if="parking">
        <!-- Hero -->
        <div>
          <h4 class="font-semibold">{{ parking.name }}</h4>
          <p class="text-white/70">
            <Icon icon="mdi:location" width="24" height="24" class="inline" />
            {{ parking.address }}
          </p>
          <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 " />
        </div>
        <!-- End Hero -->

        <div class="grid grid-cols-1 md:grid-cols-2">

          <div v-auto-animate>
            <!-- Parking Layout -->
            <div class="mt-5 flex flex-col bg-black w-full overflow-x-scroll">
              <div v-for="(row, indexRow) in parking.layout" class="flex">
                <div v-for="(col, indexCol) in row">
                  <button v-if="col == `P`" :class="[
                    'block relative w-16 aspect-square p-1 cursor-pointer',
                    selected == `${indexRow}-${indexCol}` ? 'bg-accent/70' :
                      (slots[`${indexRow}-${indexCol}`].status == 'BOOKED' ? 'bg-brand' :
                        (slots[`${indexRow}-${indexCol}`].status == 'OCCUPIED' ? 'bg-red-500' : 'bg-white/10'))
                  ]" :disabled="slots[`${indexRow}-${indexCol}`].status !== 'AVAILABLE'"
                    @click="selected = `${indexRow}-${indexCol}`">
                    <div
                      class="border-4 border-white/25 text-white/70 border-dotted w-full h-full mx-auto text-center flex items-center gap-2">
                      <div class="mx-auto">
                        <Icon icon="mdi:parking" width="24" height="24" />
                        <div class="text-xs text-white/50 absolute left-0 bottom-2 mx-auto w-full">
                          <span>{{ indexRow }}{{ indexCol }}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                  <div v-if="col == `EMPTY`"
                    :class="`w-16 aspect-square text-center bg-transparent flex items-center gap-2`">
                  </div>
                  <div v-if="col == `ROAD`"
                    :class="`w-16 aspect-square text-center bg-white/10 flex items-center gap-2`">
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

          <!-- Booking Form -->
          <div v-auto-animate>
            <div v-if="openBookingMenu" class="mt-5">
              <Form class="p-5 rounded-3xl bg-white/10 w-full max-w-xl" @submit="handleBooking"
                v-if="useAuthStore().isAuthenticated">
                <div class="text-center">
                  <h2>Form Booking</h2>
                  <h4>Slot Parkir <span class="font-bold text-brand">{{ slots[selected].name }}</span></h4>
                </div>
                <label for="plate_number">
                  <h4>Plat Nomor Kendaraan</h4>
                  <Field id="plate_number" name="plate_number" type="text" placeholder="KB 4 GIL"
                    :rules="CreateBookingRequest.plate_number" class="w-full" />
                  <br>
                  <ErrorMessage name="plate_number" class="text-sm italic text-red-200" />
                </label>
                <label for="start_time">
                  <h4>Waktu Masuk</h4>
                  <Field id="start_time" name="start_time" type="time" placeholder="user@email.com" v-model="startTime"
                    class="w-full" />
                  <br>
                  <ErrorMessage name="start_at" class="text-sm italic text-red-200" />
                </label>
                <label for="total_hours">
                  <h4>Berapa Jam?</h4>
                  <Field id="total_hours" name="total_hours" as="select" class="w-full" v-model="totalHours">
                    <option value="3">3 Jam</option>
                    <option value="4">4 Jam</option>
                    <option value="5">5 Jam</option>
                    <option value="6">6 Jam</option>
                  </Field>
                  <br>
                  <ErrorMessage name="total_hours" class="text-sm italic text-red-200" />
                </label>
                <label for="end_at" hidden>
                  <h4>Waktu Selesai</h4>
                  <Field id="end_at" name="end_at" type="datetime-local" placeholder="user@email.com" v-model="endAt"
                    class="w-full" readonly />
                  <br>
                  <ErrorMessage name="end_at" class="text-sm italic text-red-200" />
                </label>

                <p class="mt-2 italic text-white/70">*Biaya Rp{{ Intl.NumberFormat("id-ID").format(slots[selected].fee)
                }}/jam</p>

                <div v-if="bookingPostFetch.status.value == 'error'" class="mt-2">
                  <p class="text-sm italic text-red-200">Error: {{ bookingPostFetch.error.value?.data?.message ??
                    "Something went wrong" }}</p>
                </div>

                <Button class="w-full mt-5">
                  <template #text>
                    <p v-if="bookingPostFetch.status.value == 'pending'">Loading...</p>
                    <p v-else>
                      Booking Sekarang Rp{{ Intl.NumberFormat("id-ID").format(slots[selected].fee * totalHours) }}
                    </p>
                  </template>
                </Button>
              </Form>

              <div v-else class="p-5 rounded-3xl bg-white/10 w-full max-w-xl">
                <div class="text-center">
                  <h2>Login</h2>
                  <h4>Login untuk melakukan pemesanan</h4>
                </div>

                <NuxtLink :href="`/auth/login?redirect_url=${useRequestURL()}`" bg="bg-white" class="block mt-5">
                  <Button bg="bg-white" class="w-full">
                    <template #icon>
                      <Icon icon="flat-color-icons:google" width="24" height="24" />
                    </template>
                    <template #text>Masuk</template>
                  </Button>
                </NuxtLink>
              </div>
            </div>
          </div>
          <!-- End Booking Form -->
        </div>

        <!-- Booking Button -->
        <div v-auto-animate class="mt-5">
          <Button v-if="selected" @click="openBookingMenu = !openBookingMenu">
            <template #icon>
              <Icon v-if="!openBookingMenu" icon="solar:alt-arrow-right-bold" width="24" height="24" />
              <Icon v-else icon="solar:alt-arrow-left-bold" width="24" height="24" />
            </template>
            <template #text>
              <div v-auto-animate>
                <p v-if="!openBookingMenu">Lanjut Booking Rp{{ Intl.NumberFormat("id-ID").format(slots[selected].fee)
                  }}/jam</p>
                <p v-else>Kembali</p>
              </div>
            </template>
          </Button>
        </div>
        <!-- End Booking Button -->
      </div>
    </div>

  </NuxtLayout>
</template>
