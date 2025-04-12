<script setup lang="ts">
import type { Auth } from '~/lib/types/auth'
import type { Response } from '~/lib/types/response'


useSeoMeta({
  author: "Agil Ghani Istikmal",
  creator: "Agil Ghani Istikmal",
  themeColor: "oklch(84.03% 0.1724 84.08)",
}, {
  mode: "server"
})

const cookieToken = useCookie("token")
const route = useRoute()

if (route.query.token) {
  cookieToken.value = route.query.token as string
  useRouter().replace(route.path)
}

const currentUser = ref(await useAuthStore().getCurrentUser)

if (!currentUser.value) {
  useRouter().replace("/auth/login")
}
</script>

<template>
  <div class="bg-black min-h-screen">
    <div class="flex">
      <slot name="navbar">
        <NavbarDashboard />
      </slot>
      <main class="font-jakarta w-full bg-black text-white px-8 mt-5">
        <slot />
      </main>
    </div>
  </div>
</template>