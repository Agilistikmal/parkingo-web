<script setup lang="ts">
import { NuxtImg } from '#components';
import { Icon } from '@iconify/vue/dist/iconify.js';

const currentUser = ref()

onMounted(async () => {
  const user = await useAuthStore().getCurrentUser
  currentUser.value = user
})

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
            <NuxtLink href="/d/bookings">
              <span>Booking</span>
            </NuxtLink>
            <div>
              <div v-if="currentUser" class="relative">
                <NuxtLink href="/d/account" class="flex items-center gap-1">
                  <Icon icon="solar:user-bold" width="24" height="24" />
                  <p>{{ currentUser.username }}</p>
                </NuxtLink>
              </div>
              <div v-else>
                <NuxtLink href="/auth/login" bg="bg-white">
                  <Button bg="bg-white">
                    <template #icon>
                      <Icon icon="flat-color-icons:google" width="24" height="24" />
                    </template>
                    <template #text>Masuk</template>
                  </Button>
                </NuxtLink>
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