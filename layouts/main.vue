<script setup lang="ts">
import type { Response } from '~/lib/types/response'
import type { User } from '~/lib/types/user'


useSeoMeta({
  author: "Agil Ghani Istikmal",
  creator: "Agil Ghani Istikmal",
  themeColor: "oklch(84.03% 0.1724 84.08)",
}, {
  mode: "server"
})

const route = useRoute()

if (route.query.token) {
  const cookieToken = useCookie("token")
  cookieToken.value = route.query.token as string
  useAuthStore().token = cookieToken.value
  useRouter().replace(route.path)
}
</script>

<template>
  <div class="bg-black min-h-screen">
    <slot name="navbar">
      <Navbar />
    </slot>
    <main class="font-jakarta w-full bg-black text-white">
      <slot />
    </main>
    <slot name="footer">
      <Footer />
    </slot>
  </div>
</template>