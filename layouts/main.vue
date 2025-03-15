<script setup lang="ts">

useSeoMeta({
  author: "Agil Ghani Istikmal",
  creator: "PT SAFATANC TECHNOLOGY DIGITAL",
  themeColor: "#FFBF00",
}, {
  mode: "server"
})

const cookieToken = useCookie("token")
const route = useRoute()

if (route.query.token) {
  cookieToken.value = route.query.token as string
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