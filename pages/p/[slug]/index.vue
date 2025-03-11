<script setup lang="ts">
import { NuxtLayout } from '#components';
import { Icon } from '@iconify/vue'

useSeoMeta({
  title: "Parkingo - UTY 1",
  ogTitle: "Parkingo - UTY 1",
  twitterTitle: "Parkingo - UTY 1",

  ogUrl: "https:/parkingo.agil.zip",
  twitterSite: "https:/parkingo.agil.zip",

  description: "Solusi pintar parkir modern",
  ogDescription: "Solusi pintar parkir modern",
  twitterDescription: "Solusi pintar parkir modern",

  ogImage: "https:/parkingo.agil.zip/assets/logo.png",
  twitterImage: "https:/parkingo.agil.zip/assets/logo.png",
  twitterCard: "summary_large_image"
}, {
  mode: "server"
})

const selected = ref();

const parking = ref({
  "id": "mall_abc",
  "name": "Mall ABC",
  "layout": [
    ["EMPTY", "P", "P", "DOOR", "P", "P", "P", "P", "EMPTY"],
    ["EMPTY", "ROAD", "ROAD", "ROAD", "ROAD", "ROAD", "ROAD", "ROAD", "EXIT"],
    ["EMPTY", "ROAD", "P", "P", "ROAD", "P", "P", "ROAD", "P"],
    ["IN", "ROAD", "ROAD", "ROAD", "ROAD", "P", "P", "ROAD", "P"],
    ["EMPTY", "P", "P", "P", "ROAD", "ROAD", "ROAD", "ROAD", "P"],
  ],
  "created_at": "2025-03-07T12:00:00Z",
  "updated_at": "2025-03-07T12:30:00Z"
})

const config = useRuntimeConfig()

const user = ref()

const authStore = useAuthStore()
if (authStore.isAuthenticated) {
  user.value = await $fetch("/v1/users/me", {
    baseURL: config.public.apiBase,
    headers: {
      "Authorization": "Bearer " + useCookie("token").value
    }
  })
}

</script>

<template>
  <NuxtLayout name="main">
    <div class="pb-48 pt-16 md:pt-48 px-8 w-full max-w-screen-xl mx-auto min-h-screen">
      <!-- Hero -->
      <div>
        <h4 class="font-semibold">UTY 1</h4>
        <p class="text-white/70">
          <Icon icon="mdi:location" width="24" height="24" class="inline" />
          Jl. Siliwangi Jl. Jombor Lor, Mlati Krajan, Sendangadi, Kec. Mlati, Kabupaten Sleman, Daerah Istimewa
          Yogyakarta 55284
        </p>
        <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
      </div>
      <!-- End Hero -->

      <!-- Parking Layout -->
      <div class="mt-5 flex flex-col bg-black w-full">
        <div v-for="(row, indexRow) in parking.layout" class="flex">
          <div v-for="(slot, indexSlot) in row">
            <button v-if="slot == `P`"
              :class="`block relative w-16 aspect-square bg-white/10 ${selected == `${indexRow}-${indexSlot}` && `bg-accent`} p-1 cursor-pointer`"
              @click="selected = `${indexRow}-${indexSlot}`">
              <div
                class="border-4 border-white/25 text-white/70 border-dotted w-full h-full mx-auto text-center flex items-center gap-2">
                <div class="mx-auto">
                  <Icon icon="mdi:parking" width="24" height="24" />
                  <div class="text-xs text-white/50 absolute left-0 bottom-2 mx-auto w-full">
                    <span>{{ indexRow }}-{{ indexSlot }}</span>
                  </div>
                </div>
              </div>
            </button>
            <div v-if="slot == `EMPTY`"
              :class="`w-16 aspect-square text-center bg-transparent flex items-center gap-2`">
            </div>
            <div v-if="slot == `ROAD`" :class="`w-16 aspect-square text-center bg-white/10 flex items-center gap-2`">
            </div>
            <div v-if="slot == `IN`"
              :class="`w-16 aspect-square text-center bg-green-200 text-green-500 font-semibold flex items-center gap-2`">
              <div class="mx-auto">
                {{ slot }}
              </div>
            </div>
            <div v-if="slot == `DOOR`"
              :class="`w-16 aspect-square text-center bg-green-500 text-green-200 font-semibold flex items-center gap-2`">
              <div class="mx-auto">
                {{ slot }}
              </div>
            </div>
            <div v-if="slot == `EXIT`"
              :class="`w-16 aspect-square text-center bg-red-200 text-red-500 font-semibold flex items-center gap-2`">
              <div class="mx-auto">
                {{ slot }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- End Parking Layout -->

      <!-- Available Map -->
      <div class="mt-5 grid grid-cols-12 gap-2">
        <button v-for="(slot, index) in 24" @click="selected = slot">
          <div v-if="selected == slot" class="p-5 bg-accent text-black">
            <p class="text-center font-semibold">{{ slot }}</p>
          </div>
          <div v-else class="p-5 bg-white/10">
            <p class="text-center font-semibold">{{ slot }}</p>
          </div>
        </button>
      </div>
      <div class="mt-5 flex items-center justify-center gap-8 text-sm text-white/70">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-white/10"></div>
          <p>Kosong/Tersedia</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="p-2 bg-accent"></div>
          <p>Pilihan</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="p-2 bg-brand"></div>
          <p>Sudah dibooking</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="p-2 bg-red-500"></div>
          <p>Sedang terisi</p>
        </div>
      </div>
      <!-- End Available Map -->

      <!-- Form Booking -->
      <form action="" class="mt-5 w-full max-w-xl bg-white/5 p-5 rounded-3xl mx-auto space-y-4">
        <h3 class="font-semibold text-center">Booking slot parkir</h3>
        <label for="plate_number" class="space-y-1">
          <h4>Plat Nomor Kendaraan</h4>
          <div class="flex items-center gap-2">
            <input type="text" name="plate_number_prefix" id="plate_number_prefix" maxlength="2" placeholder="AB"
              class="w-24 text-center uppercase" required>
            <input type="text" name="plate_number" id="plate_number" maxlength="4" placeholder="1234"
              class="w-full text-center uppercase" required>
            <input type="text" name="plate_number_suffix" id="plate_number_suffix" maxlength="3" placeholder="XY"
              class="w-24 text-center uppercase">
          </div>
        </label>
        <label for="parking_slot" class="space-y-1">
          <div>
            <h4>Slot Parkir</h4>
            <p class="text-sm text-white/70 italic">*Pilih slot parkir melalui denah diatas</p>
          </div>
          <input type="text" name="parking_slot" id="parking_slot" class="w-full text-center font-semibold uppercase"
            :value="selected" required readonly :hidden="!selected">
        </label>
        <label for="email" class="space-y-1">
          <div>
            <h4>Alamat Email</h4>
            <p class="text-sm text-white/70 italic">*Alamat email untuk mengirim invoice</p>
          </div>
          <div>
            <input type="email" name="email" id="email" placeholder="user@email.com" class="w-full"
              :value="user.data.email" required>
          </div>
        </label>
        <Button class="w-full mt-8">
          <template #text>Lanjutkan Pembayaran</template>
        </Button>
      </form>
      <!-- End Form Booking -->
    </div>

  </NuxtLayout>
</template>