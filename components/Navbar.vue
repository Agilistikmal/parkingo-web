<script setup lang="ts">
import { NuxtImg } from '#components';
import { Icon } from '@iconify/vue/dist/iconify.js';
import type { Auth } from '~/lib/types/auth';
import type { Response } from '~/lib/types/response';

async function handleLogin() {
  const res: Response<Auth> = await $fetch("/v1/authenticate?redirect_url=" + window.location.origin, {
    baseURL: useRuntimeConfig().public.apiBase
  })
  if (res.data) {
    await navigateTo(res.data.url, {
      external: true,
    })
  }
}

async function handleLogout() {
  useAuthStore().logout()
}

const currentUser = ref(await useAuthStore().getCurrentUser)

</script>

<template>
  <nav class="text-white fixed top-0 left-0 w-full backdrop-blur md:backdrop-blur-3xl z-50">
    <div class="w-full max-w-screen-2xl mx-auto px-8 py-5">
      <div class="flex items-center justify-between gap-8 flex-wrap">
        <!-- Left Side - Brand Identity -->
        <div class="flex items-center gap-1">
          <NuxtLink href="/">
            <NuxtImg src="/assets/logo.png" class="h-12" />
          </NuxtLink>
        </div>

        <!-- Right Side - Navigation -->
        <!-- Desktop -->
        <div class="hidden md:flex items-center gap-2">
          <!-- Menu -->
          <div class="flex items-center gap-6">
            <NuxtLink href="/">
              <span>Beranda</span>
            </NuxtLink>
            <NuxtLink href="/bookings">
              <span>Booking</span>
            </NuxtLink>
            <div>
              <div v-if="useAuthStore().isAuthenticated" class="relative">
                <NuxtLink href="/account" class="flex items-center gap-1">
                  <Icon icon="solar:user-bold" width="24" height="24" />
                  <p>{{ currentUser?.username }}</p>
                </NuxtLink>
              </div>
              <div v-else>
                <Button bg="bg-white" @click="handleLogin">
                  <template #icon>
                    <Icon icon="flat-color-icons:google" width="24" height="24" />
                  </template>
                  <template #text>Masuk</template>
                </Button>
              </div>
            </div>
          </div>

          <!-- Spacer -->
          <Icon icon="mingcute:more-2-line" width="24" height="24" class="text-white/25" />

          <!-- Contact -->
          <div class="flex items-center gap-2">
            <NuxtLink href="https://github.com/agilistikmal">
              <Icon icon="mingcute:github-line" width="24" height="24" />
            </NuxtLink>
            <NuxtLink href="https://x.com/agilistikmal">
              <Icon icon="mingcute:social-x-line" width="24" height="24" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>