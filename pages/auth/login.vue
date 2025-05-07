<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Auth } from '~/lib/types/auth';
import type { Response } from '~/lib/types/response';

const redirectUrl = useRoute().query.redirect_url || useRequestURL().origin

async function handleLogin() {
  const res: Response<Auth> = await $fetch("/v1/authenticate?redirect_url=" + redirectUrl, {
    baseURL: useRuntimeConfig().public.apiBase
  })
  if (res.data) {
    await navigateTo(res.data.url, {
      external: true,
    })
  }
}
</script>

<template>
  <div class="w-full min-h-dvh bg-black text-white">
    <div class="grid grid-cols-1 md:grid-cols-3">
      <div class="bg-brand min-h-dvh hidden md:block relative overflow-hidden">
      </div>
      <div class="w-full px-8 pt-24 md:pt-48 mx-auto col-span-2">
        <NuxtImg src="/assets/logo.png" class="h-12 mx-auto" />
        <div class="mt-5 mx-auto bg-white/10 rounded-3xl px-8 py-5 w-full max-w-xl h-max">
          <div class="text-center">
            <h2>Masuk</h2>
            <p class="text-white/70">Masuk dengan satu klik atau membuat akun jika belum terdaftar.</p>
            <p class="text-white/70 text-xs italic">Kamu akan diarahkan kembali ke <span class="text-accent">{{
              redirectUrl }}</span></p>
          </div>
          <div class="mt-5 space-y-2">
            <Button bg="bg-white/10" color="text-white" class="w-full" @click="handleLogin">
              <template #icon>
                <Icon icon="flat-color-icons:google" width="24" height="24" />
              </template>
              <template #text>Masuk dengan Google</template>
            </Button>
            <Button bg="bg-white/10" color="text-white" class="w-full !cursor-not-allowed opacity-50" disabled>
              <template #icon>
                <Icon icon="fa6-brands:x-twitter" width="24" height="24" />
              </template>
              <template #text><span class="line-through">Masuk dengan X</span></template>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>