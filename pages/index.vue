<script setup lang="ts">
import { NuxtLayout } from '#components';
import { Icon } from '@iconify/vue'

useSeoMeta({
  title: "Tipspace",
  ogTitle: "Tipspace",
  twitterTitle: "Tipspace",

  ogUrl: "https:/tipspace.org",
  twitterSite: "https:/tipspace.org",

  description: "Beri dukungan, bangun koneksi di TipSpace",
  ogDescription: "Beri dukungan, bangun koneksi di TipSpace",
  twitterDescription: "Beri dukungan, bangun koneksi di TipSpace",

  ogImage: "https:/tipspace.org/banner/Banner.png",
  twitterImage: "https:/tipspace.org/banner/Banner.png",
  twitterCard: "summary_large_image"
}, {
  mode: "server"
})
</script>

<template>
  <NuxtLayout name="main">
    <div class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-xl mx-auto min-h-screen">
      <!-- Hero -->
      <div class="flex flex-col-reverse md:grid md:grid-cols-2 justify-between gap-8">
        <!-- Left side -->
        <div class="text-center md:text-left">
          <NuxtImg src="/logo.png" class="h-16" />
          <h3 class="text-accent">Beri dukungan, bangun koneksi di TipSpace</h3>
          <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
          <h4>Tempat dimana fans dapat memberi dukungan kepada kreator.</h4>
          <div class="flex items-center gap-2 mt-5 justify-center md:justify-start">
            <NuxtLink href="/register">
              <Button class="mt-2">
                <template #icon>
                  <Icon icon="solar:login-3-bold-duotone" width="24" height="24" />
                </template>
                <template #text>Daftar</template>
              </Button>
            </NuxtLink>
            <NuxtLink href="/creator">
              <Button class="mt-2" bg="bg-accent/5" color="text-white">
                <template #icon>
                  <Icon icon="solar:magnifer-line-duotone" width="24" height="24" />
                </template>
                <template #text>Cari kreator</template>
              </Button>
            </NuxtLink>
          </div>
        </div>

        <!-- Right side -->
        <div class="relative w-full h-max z-0 flex justify-center items-center mb-8">
          <div class="-z-10 top-0 left-0 w-full">
            <NuxtImg src="/image/logo/logo_eye_left.png" alt="" class="mx-auto animate-blur w-48 lg:w-96" />
          </div>
          <div class="absolute -bottom-10 left-0 w-full">
            <NuxtImg src="/image/logo/logo_eye_left.png" alt="" class="z-20 mx-auto w-48 lg:w-96" />
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-24">
        <Card class="w-full max-w-sm md:max-w-lg">
          <template #title>Dukungan</template>
          <template #content>
            <h4>Dapatkan dukungan dari fans atas usahamu! 😎</h4>
          </template>
        </Card>
        <Card class="ml-auto w-full max-w-sm md:max-w-lg">
          <template #title>Interaktif</template>
          <template #content>
            <h4>Interaksi antar fans dan kreator semakin seru! 😆</h4>
          </template>
        </Card>
        <Card class="w-full max-w-sm md:max-w-lg">
          <template #title>Koneksi</template>
          <template #content>
            <h4>Hubungan yang baik suatu saat bisa menjadi koneksi, bukan? 👀</h4>
          </template>
        </Card>
      </div>

      <!-- Reason -->
      <div class="mt-16 space-y-16">
        <!-- Kenapa Tipspace -->
        <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
          <div class="md:mx-auto">
            <NuxtImg src="/image/Diafragma.svg" alt="" class="w-32 md:w-72" />
          </div>
          <div>
            <h2 class="text-accent font-semibold">Kenapa Tipspace?</h2>
            <h4 class="text-justify">Dengan tipspace, kreator tidak hanya mendapat dukungan dari fans. Kreator dapat
              membangun
              komunitas dan menciptakan koneksi yang bermanfaat.</h4>
            <p class="text-justify">Tipspace bagaikan diafragma bunga <span class="text-accent">Rafflesia</span>
              yang
              melingkar
              menyatukan kelopak-kelopak menjadi satu. Kelopak itu adalah kalian, para penggemar setia 😊.</p>
          </div>
        </div>

        <!-- Kreator -->
        <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
          <div class="md:mx-auto">
            <FaceAnimate class="w-32 md:w-72" />
          </div>
          <div>
            <h2 class="text-accent font-semibold">Kreator</h2>
            <h4 class="text-justify">Apalah arti kreator tanpa dukungan fans?</h4>
            <p class="text-justify">Kreator tanpa dukungan fans diibaratkan seperti bunga <span
                class="text-accent">Rafflesia</span> yang hampa, tidak memiliki kelopak-kelopak, kedinginan,
              kesepian,
              dan
              mungkin tidak dapat bertahan lebih lama 😥.</p>
          </div>
        </div>

        <!-- Fans -->
        <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
          <div class="md:mx-auto">
            <NuxtImg src="/image/Kelopak.svg" alt="" class="w-32 md:w-72" />
          </div>
          <div>
            <h2 class="text-accent font-semibold">Penggemar / Fans</h2>
            <h4 class="text-justify">Fans tidak hanya memberikan dukungan materi, mereka juga memberikan validasi,
              semangat,
              dan energi yang mendorong kreator untuk terus bekerja. Fans juga menunjukkan penerimaan dan
              penghargaan
              terhadap
              gagasan, visi, atau ekspresi kreatif seorang kreator.</h4>
            <p>Bagaikan kelopak-kelopak bunga <span class="text-accent">Rafflesia</span>, fans saling melengkapi,
              menjadi
              barisan terdepan melindungi dan memberi kehangatan kreator 🏇.</p>
          </div>
        </div>

        <!-- Join Now -->
        <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
          <div class="md:mx-auto">
            <div class="relative w-full h-max z-0 flex justify-center items-center mb-8">
              <div class="-z-10 top-0 left-0 w-full">
                <NuxtImg src="/image/logo/logo_eye_center.png" alt="" class="animate-blur w-32 md:w-72" />
              </div>
              <div class="absolute -bottom-10 left-0 w-full">
                <NuxtImg src="/image/logo/logo_eye_center.png" alt="" class="z-20 w-32 md:w-72" />
              </div>
            </div>
          </div>
          <div>
            <h2 class="text-accent font-semibold">Gabung Sekarang</h2>
            <h4 class="text-justify">Ayo bergabung dan nikmati keseruannya!</h4>
            <NuxtLink href="/register">
              <Button class="mt-2" bg="bg-accent" color="text-black">
                <template #icon>
                  <Icon icon="solar:login-3-bold-duotone" width="24" height="24" />
                </template>
                <template #text>Gabung Sekarang</template>
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>