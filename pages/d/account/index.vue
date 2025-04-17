<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { UpdateUserRequest, type User } from '~/lib/types/user';

const errors = ref()
const loading = ref(false);

const currentUser = ref<User | null>()
const username = ref<string>('')
const fullName = ref<string>('')

onMounted(async () => {
  currentUser.value = await useAuthStore().getCurrentUser
  username.value = currentUser.value?.username || ''
  fullName.value = currentUser.value?.full_name || ''
})

async function handleUpdateUser() {

}
</script>

<template>
  <NuxtLayout name="dashboard">
    <div>
      <h3>Pengaturan Akun</h3>
      <p>Menampilkan pengaturan tentang akun</p>
      <div class="px-5 py-1 rounded-lg bg-brand w-max my-2 mx-auto md:mx-0" />
    </div>

    <div class="space-y-2">
      <div class="p-5 rounded-3xl bg-white/10 w-full max-w-xl">
        <div class="space-y-2">
          <div>
            <h4>Foto Profil</h4>
          </div>
          <div class="group w-max h-max relative">
            <NuxtImg
              src="https://static.wixstatic.com/media/9258cc_10a2e00d0ba94f77b2d94b1ec687cafe~mv2.png/v1/fill/w_87,h_41,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9258cc_10a2e00d0ba94f77b2d94b1ec687cafe~mv2.png"
              class="w-32 h-32 rounded-3xl object-contain bg-white" />
            <div class="hidden group-hover:block absolute top-0 left-0 w-full h-full bg-black/70 rounded-3xl">
              <div class="flex items-center justify-center h-full gap-2">
                <Icon icon="mingcute:camera-fill" width="24" height="24" class="text-white" />
                <span class="text-white">Ganti Foto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Form class="p-5 rounded-3xl bg-white/10 w-full max-w-xl" @submit="handleUpdateUser">
        <div class="space-y-2" v-auto-animate>
          <label for="username">
            <span>Username</span>
            <Field id="username" name="username" type="text" placeholder="Username" :rules="UpdateUserRequest.username"
              class="w-full" v-model="username" />
            <br>
            <ErrorMessage name="username" class="text-sm italic text-red-200" />
          </label>
          <label for="full_name">
            <span>Nama Lengkap</span>
            <Field id="full_name" name="full_name" type="text" placeholder="Nama Lengkap"
              :rules="UpdateUserRequest.full_name" class="w-full" v-model="fullName" />
            <br>
            <ErrorMessage name="full_name" class="text-sm italic text-red-200" />
          </label>
        </div>

        <div v-if="errors">{{ errors }}</div>
        <Button class="w-full mt-5">
          <template #text v-if="loading">Loading...</template>
          <template #text v-else>Simpan</template>
        </Button>
      </Form>

      <div class="p-5 rounded-3xl bg-white/10 w-full max-w-xl">
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <h4>Google Info</h4>
            <div>
              <Icon v-if="currentUser?.google_id" icon="mingcute:check-circle-fill" width="24" height="24"
                class="text-green-500" />
              <Icon v-else icon="mingcute:check-circle-fill" width="24" height="24" class="text-red-500" />
            </div>
          </div>
          <div v-if="currentUser?.google_id">
            <div class="flex items-center gap-2">
              <Icon icon="mingcute:idcard-fill" width="24" height="24" />
              <span>{{ currentUser.google_id }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="mingcute:mail-fill" width="24" height="24" />
              <span>{{ currentUser.email }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>