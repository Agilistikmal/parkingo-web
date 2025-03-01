<script setup lang="ts">
import { NuxtImg } from '#components';
import { Icon } from '@iconify/vue/dist/iconify.js';

</script>

<template>
  <nav class="text-white fixed top-0 left-0 w-full backdrop-blur md:backdrop-blur-3xl z-50">
    <div class="w-full max-w-screen-2xl mx-auto px-8 py-5">
      <div class="flex items-center justify-between gap-8 flex-wrap">
        <!-- Left Side - Brand Identity -->
        <div class="flex items-center gap-1">
          <NuxtImg src="/logo.png" class="h-12" />
        </div>

        <!-- Right Side - Navigation -->
        <!-- Desktop -->
        <div class="hidden md:flex items-center gap-2">
          <!-- Menu -->
          <div class="flex items-center gap-4">
            <NuxtLink href="/">
              <span>Beranda</span>
            </NuxtLink>
            <NuxtLink href="/booking">
              <span>Booking</span>
            </NuxtLink>
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