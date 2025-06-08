<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Booking } from '~/lib/types/booking';
import type { Parking } from '~/lib/types/parking';
import type { Response } from '~/lib/types/response';

const parkingsFetch = useFetch<Response<Parking[]>>(`/v1/parkings`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
});
const parkings = computed(() => parkingsFetch.data.value?.data);
const selectedParking = ref<Parking | null>(null)

const bookingsFetch = useFetch<Response<Booking[]>>(`/v1/bookings?parking_id=${selectedParking.value?.id}`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
  immediate: false,
  watch: [selectedParking],
});
const bookings = computed(() => bookingsFetch.data.value?.data);

function getStatusColor(status: string): string {
  switch (status) {
    case 'UNPAID':
      return 'bg-yellow-500/20 text-yellow-300';
    case 'PAID':
      return 'bg-green-500/20 text-green-300';
    case 'EXPIRED':
      return 'bg-red-500/20 text-red-300';
    case 'CANCELED':
      return 'bg-red-500/20 text-red-300';
    case 'OCCUPIED':
      return 'bg-green-500/20 text-green-300';
    case 'COMPLETED':
      return 'bg-blue-500/20 text-blue-300';
    default:
      return '';
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case 'UNPAID':
      return 'mdi:clock-alert';
    case 'PAID':
      return 'mdi:check-circle';
    case 'EXPIRED':
      return 'mdi:clock-remove';
    case 'CANCELED':
      return 'mdi:close-circle';
    case 'OCCUPIED':
      return 'mdi:car';
    case 'COMPLETED':
      return 'mdi:check-circle';
    default:
      return 'mdi:help-circle';
  }
}
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="mb-8">
      <h3>Riwayat Booking (Admin)</h3>
      <p class="text-gray-400">Menampilkan riwayat parkir spesifik</p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2" />
    </div>

    <!-- Parking List -->
    <div>
      <div v-if="parkingsFetch.status.value == 'pending'" class="flex items-center justify-center p-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
      <div v-else-if="parkingsFetch.status.value == 'error'" class="bg-red-500/10 text-red-500 p-6 rounded-3xl">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:alert-circle" width="24" height="24" />
          <p>{{ parkingsFetch.error.value?.data.message }}</p>
        </div>
      </div>

      <div v-else-if="!parkings?.length" class="bg-white/5 backdrop-blur-lg rounded-3xl p-12 text-center">
        <Icon icon="mdi:calendar-blank" class="mx-auto mb-4 text-gray-400" width="48" height="48" />
        <p class="text-gray-400">Area parkir tidak ditemukan.</p>
      </div>

      <!-- Select Parking wutg Dropdown -->
      <div v-else>
        <div class="flex items-center gap-2">
          <Icon icon="mdi:parking" width="24" height="24" />
          <p>Pilih area parkir</p>
        </div>
        <select v-model="selectedParking"
          class="w-full max-w-screen-sm px-5 py-3 rounded-lg bg-white/10 text-white backdrop-blur-lg mt-5 placeholder:text-white"
          placeholder="Pilih area parkir">
          <option v-for="parking in parkings" :key="parking.id" :value="parking">
            {{ parking.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Booking List -->
    <div v-if="selectedParking" class="mt-5">
      <div v-if="bookingsFetch.status.value == 'pending'" class="flex items-center justify-center p-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>

      <div v-else-if="bookingsFetch.status.value == 'error'" class="bg-red-500/10 text-red-500 p-6 rounded-3xl">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:alert-circle" width="24" height="24" />
          <p>{{ bookingsFetch.error.value?.data.message }}</p>
        </div>
      </div>

      <div v-else-if="!bookings?.length" class="bg-white/5 backdrop-blur-lg rounded-3xl p-12 text-center">
        <Icon icon="mdi:calendar-blank" class="mx-auto mb-4 text-gray-400" width="48" height="48" />
        <p class="text-gray-400">Riwayat booking tidak ditemukan.</p>
      </div>

      <div v-else>
        <p class="text-gray-400">{{ selectedParking.name }} | {{ bookings?.length }} bookings</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          <div v-for="booking in bookings" :key="booking.id"
            class="bg-white/5 backdrop-blur-lg rounded-3xl p-6 hover:bg-white/10 transition-colors duration-200">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4 gap-2 flex-col-reverse md:flex-row">
              <div>
                <h4 class="font-semibold text-xl">{{ booking.parking?.name }}</h4>
                <p class="text-gray-400 text-sm">{{ booking.plate_number }}</p>
              </div>
              <div :class="`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(booking.status)}`">
                <Icon :icon="getStatusIcon(booking.status)" width="24" height="24" />
                <span class="text-sm font-medium">{{ booking.status }}</span>
              </div>
            </div>

            <!-- Details -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center gap-2 text-gray-400">
                <Icon icon="mdi:calendar" width="24" height="24" />
                <span>{{ Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(booking.start_at))
                  }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <Icon icon="mdi:clock" width="24" height="24" />
                <span>{{ Intl.DateTimeFormat("id-ID", { timeStyle: "long" }).format(new Date(booking.start_at))
                  }}</span>
                <span class="text-gray-400">-</span>
                <span>{{ Intl.DateTimeFormat("id-ID", { timeStyle: "long" }).format(new Date(booking.end_at)) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2 font-semibold text-lg">
                  <Icon icon="mdi:cash" width="24" height="24" class="text-brand" />
                  <span>Rp{{ Intl.NumberFormat("id-ID").format(booking.total_fee) }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-400">
                  <Icon icon="mdi:clock" width="24" height="24" />
                  <span>{{ booking.total_hours }} jam</span>
                </div>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <Icon icon="mdi:user" width="24" height="24" />
                <span>{{ booking.user.full_name }}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <Icon icon="mdi:email" width="24" height="24" />
                <span>{{ booking.user.email }}</span>
              </div>
            </div>

            <!-- Action -->
            <NuxtLink :href="`/b/${booking.payment_reference}`" target="_blank">
              <Button class="w-full">
                <template #text>{{ booking.status === 'UNPAID' ? 'Bayar Sekarang' : 'Lihat Detail' }}</template>
                <template #icon>
                  <Icon icon="mdi:external-link" width="24" height="24" />
                </template>
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
