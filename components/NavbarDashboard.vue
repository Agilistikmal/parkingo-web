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

const openSidebar = ref(false)

</script>

<template>
  <nav
    :class="`text-white w-max p-8 bg-black absolute z-50 rounded-3xl md:rounded-none top-0 left-0 md:relative md:min-h-screen md:w-xs`">
    <div class="block md:hidden" @click="openSidebar = !openSidebar">
      <button v-if="!openSidebar">
        <Icon icon="mdi:hamburger-menu" width="24" height="24" class="text-white" />
      </button>
      <button v-else>
        <Icon icon="mdi:close" width="24" height="24" class="text-white" />
      </button>
    </div>

    <div :class="`flex flex-col justify-between h-full gap-2 ${!openSidebar && 'hidden'} md:flex`">
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

        <div v-if="currentUser?.role == 'ADMIN'">
          <h4>Admin Menu</h4>
          <div v-for="adminMenu in adminMenus">
            <NuxtLink :href="adminMenu.href" class="border-l-2 border-brand pl-2">
              <span>{{ adminMenu.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <Button bg="bg-red-500" color="text-white" @click="handleLogout" class="fixed bottom-5 left-5">
        <template #icon>
          <Icon icon="mdi:logout" width="24" height="24" />
        </template>
        <template #text>Logout</template>
      </Button>
    </div>
  </nav>
</template>