<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Booking } from '~/lib/types/booking'
import type { Response } from '~/lib/types/response'

const result = ref('')
let html5QrCode: any

onMounted(async () => {
  if (import.meta.client) {
    const { Html5Qrcode } = await import('html5-qrcode')
    html5QrCode = new Html5Qrcode("qr-reader")

    const config = { fps: 10, qrbox: { width: 500, height: 500 } }

    html5QrCode.start(
      { facingMode: "environment" }, // kamera belakang
      config,
      (decodedText: string) => {
        result.value = decodedText
      },
      (errorMessage: string) => {
        // Optional: console.log('No QR code detected', errorMessage)
      }
    )
  }
})

onBeforeUnmount(() => {
  if (html5QrCode) html5QrCode.stop().catch(() => { })
})


const checkoutFetch = useFetch<Response<Booking>>(
  () => `/v1/bookings/checkout/${result.value}`,
  {
    baseURL: useRuntimeConfig().public.apiBase,
    headers: {
      Authorization: "Bearer " + useAuthStore().token,
    },
    method: "POST",
    key: result.value,
    immediate: false,
    watch: [result],
  }
)
const booking = computed(() => checkoutFetch.data.value?.data);

function getStatusColor(status: string) {
  switch (status) {
    case 'PAID':
      return 'bg-green-500 text-white'
    case 'UNPAID':
      return 'bg-brand text-black'
    case 'EXPIRED':
      return 'bg-red-500 text-white'
    case 'CANCELLED':
      return 'bg-gray-500 text-white'
    case 'COMPLETED':
      return "bg-cyan-500 text-white"
    default:
      return 'bg-gray-500'
  }
}
</script>


<template>
  <NuxtLayout name="dashboard">
    <div>
      <h3>Checkout</h3>
      <p>Scan Booking QR Code pengguna</p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 " />
    </div>

    <!-- QR Code Scanner -->
    <div class="w-full max-w-screen-md rounded-3xl overflow-hidden bg-white/10 backdrop-blur-lg">
      <div id="qr-reader" class="w-full h-full"></div>
    </div>

    <!-- Booking Details -->
    <div class="px-8 w-full max-w-screen-md flex flex-wrap lg:flex-nowrap justify-center gap-4 mt-5" v-auto-animate>
      <!-- Booking Confirmation -->
      <div v-if="checkoutFetch.status.value == 'success' && booking" class="w-full max-w-screen-sm mx-auto">
        <div :class="`p-5 rounded-3xl rounded-b-xl ${getStatusColor(booking.status)}`">
          <div class="flex items-start justify-between gap-4 flex-col-reverse sm:flex-row">
            <div>
              <h3 class="font-semibold">Konfirmasi Booking</h3>
              <p class="text-sm">Payment Reference: <span class="font-bold">{{
                booking.payment_reference }}</span></p>
            </div>
            <div>
              <h2>{{ booking.status }}</h2>
            </div>
          </div>
        </div>
        <div class="p-5 rounded-3xl rounded-t-xl bg-white/10">
          <div>
            <hr class="mb-2 mt-5 border-t-[6px] border-dotted border-white/10">

            <div class="flex items-center gap-2">
              <Icon icon="mdi:email" width="24" height="24" />
              <span>{{ booking.user?.email }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="mdi:ticket-user" width="24" height="24" />
              <span>{{ booking.user?.full_name }}</span>
            </div>

            <hr class="my-2 border-t-[6px] border-dotted border-white/10">

            <div class="flex items-center gap-2">
              <Icon icon="mdi:access-time" width="24" height="24" />
              <div class="flex items-center gap-2">
                <span>{{ Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(new
                  Date(booking.start_at!)) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="mdi:access-time" width="24" height="24" />
              <div class="flex items-center gap-2">
                <span>{{ Intl.DateTimeFormat("id-ID", { timeStyle: "long" }).format(new
                  Date(booking.start_at!)) }}</span>
                <span>-</span>
                <span>{{ Intl.DateTimeFormat("id-ID", { timeStyle: "long" }).format(new
                  Date(booking.end_at!)) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="mdi:cash" width="24" height="24" />
              <div class="flex items-center gap-2">
                <span class="font-bold">Rp{{
                  Intl.NumberFormat("id-ID").format(booking.total_fee!)
                  }}</span>
                <span class="text-white/70">(Rp{{ Intl.NumberFormat("id-ID").format(booking.slot.fee!)
                  }} x {{
                    booking.total_hours }} jam)</span>
              </div>
            </div>

            <hr class="my-2 border-t-[6px] border-dotted border-white/10">

            <div class="flex justify-between items-start gap-2">
              <div>
                <div class="flex items-center gap-2 text-brand">
                  <Icon icon="mdi:parking" width="24" height="24" />
                  <NuxtLink :href="`/p/${booking.parking.slug}`" target="_blank">{{
                    booking.parking?.name
                    }}</NuxtLink>
                </div>
                <div class="flex items-center gap-2 text-brand">
                  <Icon icon="mdi:selection-location" width="24" height="24" />
                  <span class="font-bold">{{ booking.slot.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="checkoutFetch.status.value == 'error'" class="w-full max-w-screen-sm mx-auto">
        <div class="p-5 rounded-3xl rounded-b-xl bg-red-500 text-white">
          <h3 class="font-semibold">Error</h3>
          <p>{{ checkoutFetch.error.value?.data.message }}</p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
