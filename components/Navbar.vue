<script setup lang="ts">
import { NuxtImg } from '#components';
import { Icon } from '@iconify/vue/dist/iconify.js';

async function handleLogin() {
  const res = await fetch("https://parkingo-core.agil.zip/v1/authenticate?redirect_url=" + window.location.origin)
  if (res.status == 200) {
    const body = await res.json()
    await navigateTo(body.data.url, {
      external: true,
    })
  }
}

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
          <div class="flex items-center gap-4">
            <NuxtLink href="/">
              <span>Beranda</span>
            </NuxtLink>
            <NuxtLink href="/bookings">
              <span>Booking</span>
            </NuxtLink>
            <div>
              <Button v-if="useCookie(`token`).value" bg="bg-white">
                <template #icon>
                  <Icon icon="flat-color-icons:google" width="24" height="24" />
                </template>
                <template #text>Account</template>
              </Button>
              <Button v-else bg="bg-white" @click="handleLogin">
                <template #icon>
                  <Icon icon="flat-color-icons:google" width="24" height="24" />
                </template>
                <template #text>Masuk</template>
              </Button>
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