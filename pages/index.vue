<script setup lang="ts">
import { NuxtLayout } from '#components';
import { Icon } from '@iconify/vue'

useSeoMeta({
  title: "Parkingo",
  ogTitle: "Parkingo",
  twitterTitle: "Parkingo",

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
</script>

<template>
  <NuxtLayout name="main">
    <div class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-xl mx-auto min-h-screen">
      <!-- Hero -->
      <div class="flex flex-col-reverse md:grid md:grid-cols-2 justify-between gap-8">
        <!-- Left side -->
        <div class="text-center md:text-left">
          <NuxtImg src="/assets/logo.png" class="h-16 mx-auto md:mx-0" />
          <h3>Solusi pintar parkir modern</h3>
          <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
          <div class="flex flex-wrap items-center gap-2 mt-5 justify-center md:justify-start">
            <NuxtLink href="/p">
              <Button class="mt-2">
                <template #icon>
                  <Icon icon="mdi:parking" width="24" height="24" />
                </template>
                <template #text>Cari Parkiran</template>
              </Button>
            </NuxtLink>
            <NuxtLink href="/d/bookings">
              <Button class="mt-2" bg="bg-accent/5" color="text-white">
                <template #icon>
                  <Icon icon="mdi:car-search" width="24" height="24" />
                </template>
                <template #text>Cek Booking</template>
              </Button>
            </NuxtLink>
          </div>
        </div>

        <!-- Right side -->
        <div class="relative w-full h-max z-0 flex justify-center items-center mb-8">
          <div class="relative h-[25vh] border-8 border-brand rounded-3xl">
            <video src="/assets/video/car_booking.mp4" autoplay muted loop
              class="w-full h-full object-cover border-4 border-black rounded-2xl" />
            <div class="absolute bottom-0 right-0">
              <div class="h-[10vh] border-4 border-brand rounded-2xl overflow-hidden translate-x-10 -translate-y-28">
                <video src="/assets/video/phone_maps.mp4" autoplay muted loop
                  class="w-full h-full object-cover border-2 border-black rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
