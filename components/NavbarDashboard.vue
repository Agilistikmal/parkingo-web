<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';

async function handleLogout() {
  useAuthStore().logout()
  useRouter().push("/auth/login")
}

const currentUser = ref(await useAuthStore().getCurrentUser)

const userMenus = [
  {
    name: "Beranda",
    href: "/"
  },
  {
    name: "Riwayat Booking",
    href: "/d/bookings"
  },
  {
    name: "Akun",
    href: "/d/account"
  }
]

const adminMenus = [
  {
    name: "Area Parkir Saya",
    href: "/d/parkings"
  },
  {
    name: "Riwayat Booking Parkiran",
    href: "/d/parkings/bookings"
  },
]

</script>

<template>
  <nav class="text-white w-xs p-8 bg-white/10 min-h-dvh">
    <div class="flex flex-col justify-between h-full gap-2">
      <div class="space-y-4">

        <div>
          <NuxtImg src="/assets/logo.png" />
          <h4>Hi, {{ currentUser?.full_name }}</h4>
        </div>

        <div>
          <h4>User Menu</h4>
          <div v-for="userMenu in userMenus">
            <NuxtLink :href="userMenu.href" class="border-l-2 border-brand pl-2">
              <span>{{ userMenu.name }}</span>
            </NuxtLink>
          </div>
        </div>

        <div>
          <h4>Admin Menu</h4>
          <div v-for="adminMenu in adminMenus">
            <NuxtLink :href="adminMenu.href" class="border-l-2 border-brand pl-2">
              <span>{{ adminMenu.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <Button bg="bg-red-500" color="text-white" @click="handleLogout">
        <template #icon>
          <Icon icon="mdi:logout" width="24" height="24" />
        </template>
        <template #text>Logout</template>
      </Button>
    </div>
  </nav>
</template>