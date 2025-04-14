<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';

</script>

<template>
  <NuxtLayout name="dashboard">
    <div>
      <h3>Area Parkir Saya</h3>
      <p>Menampilkan daftar area parkir yang dimiliki</p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
    </div>

    <div class="flex items-center gap-2 w-full">
      <div class="px-5 py-1 rounded-lg bg-white/10 w-max my-2 mx-auto md:mx-0 flex-grow" />
      <NuxtLink href="/d/parking/create">
        <Button bg="bg-white/10" color="text-white">
          <template #icon>
            <Icon icon="mdi:plus" width="24" height="24" />
          </template>
          <template #text>Tambah Area Parkir</template>
        </Button>
      </NuxtLink>
    </div>

    <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-3xl bg-white/10 aspect-video">
        <h4>Parkir UTY 1</h4>
      </div>
    </div>
  </NuxtLayout>
</template>