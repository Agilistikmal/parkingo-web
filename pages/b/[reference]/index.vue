<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Booking } from '~/lib/types/booking';
import type { Response } from '~/lib/types/response';
import QRCode from 'qrcode.vue';


const reference = useRoute().params.reference as string;

const bookingFetch = useFetch<Response<Booking>>(`/v1/bookings/reference/${reference}`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
  key: reference,
});
const booking = computed(() => bookingFetch.data.value?.data);

const viewMap = ref(false);

const paymentExpiredAt = computed(() => new Date(booking.value?.payment_expired_at!));
const timeLeft = ref(0);

let interval: NodeJS.Timeout | undefined

// Fungsi untuk menghitung selisih waktu
const calculateTimeLeft = () => {
  const now = new Date()
  const difference = paymentExpiredAt.value.getTime() - now.getTime()
  if (difference > 0) {
    timeLeft.value = difference
  } else {
    timeLeft.value = 0
  }
}

const formattedTime = computed(() => {
  const totalSeconds = Math.floor(timeLeft.value / 1000)
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

onMounted(() => {
  // Hitung waktu sekarang dan target pertama kali
  calculateTimeLeft()

  // Set interval untuk update countdown setiap detik
  interval = setInterval(() => {
    calculateTimeLeft()
    if (timeLeft.value <= 0) {
      clearInterval(interval) // Hentikan interval jika countdown selesai
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval) // Pastikan interval dihentikan saat komponen dihapus
})

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
  <NuxtLayout name="main">
    <div
      class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-xl mx-auto min-h-screen flex flex-wrap lg:flex-nowrap justify-center gap-4"
      v-auto-animate>
      <!-- Booking Confirmation -->
      <div v-if="bookingFetch.status.value == 'success' && booking" class="w-full max-w-screen-sm mx-auto">
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
            <div class="my-4 flex flex-col items-center gap-2">
              <QRCode :value="booking.payment_reference" :size="200" level="H" class="bg-white p-2 rounded-lg" />
              <p class="text-sm text-white/70">Perlihatkan QR Code ini saat di pintu keluar</p>
            </div>

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

              <button class="text-accent underline" @click="viewMap = !viewMap">
                {{ viewMap ? "Tutup Denah" : "Lihat Denah" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Button -->
        <div class="mt-5">
          <NuxtLink v-if="booking.status == 'UNPAID'" :href="booking.payment_link" target="_blank">
            <Button class="w-full">
              <template #icon>
                <Icon icon="mdi:external-link" width="24" height="24" />
              </template>
              <template #text>Lanjutkan Pembayaran {{ formattedTime }}</template>
            </Button>
          </NuxtLink>
        </div>
      </div>

      <!-- View Map -->
      <div v-if="viewMap && booking" class="w-full max-w-screen-sm mx-auto">
        <ParkingLayout :layout="booking.parking.layout" :selected="`${booking.slot.row}-${booking.slot.col}`" />
      </div>
    </div>

    <div v-if="bookingFetch.status.value == 'error'">
      <div class="p-5 rounded-3xl rounded-b-xl bg-red-500 text-black">
        <h3 class="font-semibold">Error {{ bookingFetch.error.value?.statusCode }}</h3>
        <p class="text-sm">{{ bookingFetch.error.value?.statusMessage }}</p>
      </div>
      <div class="p-5 rounded-3xl rounded-t-xl bg-white/10">
        {{ bookingFetch.error.value?.message }}
      </div>
    </div>
  </NuxtLayout>
</template>