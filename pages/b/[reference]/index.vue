<script setup lang="ts">
import type { Booking } from '~/lib/types/booking';


const reference = useRoute().params.reference as string;

const booking = useAsyncData<Booking>('booking', () => {
  return $fetch('/v1/bookings/' + reference, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + useAuthStore().token,
    }
  });
});

</script>

<template>
  <NuxtLayout name="main">
    <div class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-sm mx-auto min-h-screen">
      <div class="p-5 rounded-3xl rounded-b-xl bg-brand text-black">
        <h3 class="font-semibold">Konfirmasi Booking #{{ booking.data.value?.id }}</h3>
        <p class="text-sm">Payment Reference: {{ reference }}</p>
      </div>
      <div class="p-5 rounded-3xl rounded-t-xl bg-white/10">
        asas
      </div>
    </div>
  </NuxtLayout>
</template>