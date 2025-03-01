<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

if (props.error.statusCode >= 500) {
  console.log(props.error)
}

</script>

<template>

  <NuxtLayout name="main">
    <template #navbar>
      <div></div>
    </template>
    <template #footer>
      <div class="absolute left-0 bottom-0 w-full">
        <Footer />
      </div>
    </template>

    <!-- Content -->
    <div class="w-full max-w-screen-md mx-auto px-8 pt-48 text-center">
      <div class="mx-auto w-max relative">
        <FaceAnimate />
      </div>

      <div class="mt-5">
        <h1>{{ error.statusCode }}</h1>
        <h3><span class="text-brand">{{ error.name }}:</span> {{ error.statusCode >= 999 ? error.statusMessage :
          error.message }}</h3>
      </div>

      <div class="mt-5">
        <NuxtLink href="/" class="text-accent underline">Kembali ke halaman utama</NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>