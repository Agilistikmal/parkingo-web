<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Booking } from '~/lib/types/booking';
import type { Response } from '~/lib/types/response';


const bookingsFetch = useFetch<Response<Booking[]>>(`/v1/bookings`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
});
const bookings = computed(() => bookingsFetch.data.value?.data);

function getStatusColor(status: string): string {
  switch (status) {
    case 'UNPAID':
      return 'text-yellow-300';
    case 'PAID':
      return 'text-green-300';
    case 'EXPIRED':
      return 'text-red-300';
    case 'CANCELED':
      return 'text-red-300';
    case 'OCCUPIED':
      return 'text-green-300';
    default:
      return '';
  }
}

</script>

<template>
  <NuxtLayout name="dashboard">
    <div>
      <h3>Riwayat Booking</h3>
      <p>Menampilkan riwayat pemesanan anda</p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
    </div>

    <div>
      <table class="w-full">
        <thead class="bg-brand h-12 text-black">
          <tr>
            <th>Nama</th>
            <th>Plat Nomor</th>
            <th>Waktu Pemesanan</th>
            <th>Tanggal Parkir</th>
            <th>Jam Masuk</th>
            <th>Jam Selesai</th>
            <th>Durasi</th>
            <th>Total Biaya</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody v-if="bookingsFetch.status.value == 'success'" class="text-center">
          <tr v-for="booking in bookings" :key="booking.id" class="h-12 bg-white/5">
            <td>{{ booking.parking?.name }}</td>
            <td class="font-bold">{{ booking.plate_number }}</td>
            <td>
              {{ Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "long" }).format(new
                Date(booking.created_at)) }}
            </td>
            <td>{{ Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(booking.start_at)) }}</td>
            <td>{{ Intl.DateTimeFormat("id-ID", { timeStyle: "long" }).format(new Date(booking.start_at)) }}</td>
            <td>{{ Intl.DateTimeFormat("id-ID", { timeStyle: "long" }).format(new Date(booking.end_at)) }}</td>
            <td>{{ booking.total_hours }} jam</td>
            <td>
              Rp{{ Intl.NumberFormat("id-ID").format(booking.total_fee) }}
            </td>
            <td :class="`font-bold ${getStatusColor(booking.status)}`">
              {{ booking.status }}
            </td>
            <td>
              <NuxtLink :href="`/b/${booking.payment_reference}`" target="_blank">
                <div class="flex items-center gap-1 text-center justify-center">
                  <p v-if="booking.status == 'UNPAID'" class="text-brand">Bayar</p>
                  <p v-else>Lihat</p>
                  <Icon icon="mdi:external-link" width="16" height="16" />
                </div>
              </NuxtLink>
            </td>
          </tr>
          <p v-if="!bookings">Riwayat booking tidak ditemukan.</p>
        </tbody>
      </table>
      <div v-if="bookingsFetch.status.value == 'pending'" class="text-white">
        <p>Loading...</p>
      </div>
      <div v-else-if="bookingsFetch.status.value == 'error'" class="text-red-300">
        <p>Error: {{ bookingsFetch.error.value?.data.message }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>