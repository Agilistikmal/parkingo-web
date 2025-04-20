<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Booking } from '~/lib/types/booking';
import type { Response } from '~/lib/types/response';


const reference = useRoute().params.reference as string;

const booking = useFetch<Response<Booking>>(`/v1/bookings/reference/${reference}`, {
  baseURL: useRuntimeConfig().public.apiBase,
  headers: {
    Authorization: "Bearer " + useAuthStore().token,
  },
  key: reference,
});

</script>

<template>
  <NuxtLayout name="main">
    <div class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-sm mx-auto min-h-screen" v-auto-animate>
      <div v-if="booking.status.value == 'success'">
        <div class="p-5 rounded-3xl rounded-b-xl bg-brand text-black">
          <h3 class="font-semibold">Konfirmasi Booking #{{ booking.data.value?.data?.id }}</h3>
          <p class="text-sm">Payment Reference: {{ booking.data.value?.data?.payment_reference }}</p>
        </div>
        <div class="p-5 rounded-3xl rounded-t-xl bg-white/10">
          <div>
            <div class="flex items-center gap-2">
              <Icon icon="mdi:email" width="24" height="24" />
              <span>{{ booking.data.value?.data?.user?.email }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="mdi:ticket-user" width="24" height="24" />
              <span>{{ booking.data.value?.data?.user?.full_name }}</span>
            </div>

            <hr class="my-2 border-t-[6px] border-dotted border-white/10">

            <div class="flex items-center gap-2">
              <Icon icon="mdi:parking" width="24" height="24" />
              <NuxtLink :href="`/p/${booking.data.value?.data?.parking_id}`">{{ booking.data.value?.data?.parking?.name
              }}</NuxtLink>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="mdi:selection-location" width="24" height="24" />
              <span>{{ booking.data.value?.data?.user?.full_name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="booking.status.value == 'error'">
      <div class="p-5 rounded-3xl rounded-b-xl bg-red-500 text-black">
        <h3 class="font-semibold">Error {{ booking.error.value?.statusCode }}</h3>
        <p class="text-sm">{{ booking.error.value?.statusMessage }}</p>
      </div>
      <div class="p-5 rounded-3xl rounded-t-xl bg-white/10">
        {{ booking.error.value?.message }}
      </div>
    </div>
  </NuxtLayout>
</template>