<script setup lang="ts">

useSeoMeta({
  author: "Agil Ghani Istikmal",
  creator: "PT SAFATANC TECHNOLOGY DIGITAL",
  themeColor: "#FFBF00",
}, {
  mode: "server"
})
</script>

<template>
  <div class="bg-black min-h-scree">
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