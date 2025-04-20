<script setup lang="ts">

import { Icon } from '@iconify/vue/dist/iconify.js';

defineProps({
  layout: {
    type: Array,
    default: () => [[]],
    validator: (val) => {
      return Array.isArray(val) && val.every(row => Array.isArray(row));
    },
  },
  selected: {
    type: String,
    default: '0-0',
  },
})

</script>

<template>
  <!-- Parking Layout -->
  <div class="flex flex-col bg-black overflow-x-scroll">
    <div v-for="(row, indexRow) in layout" class="flex">
      <div v-for="(col, indexCol) in row">
        <button v-if="col == `P`" :class="[
          'block relative w-16 aspect-square p-1',
          selected == `${indexRow}-${indexCol}` ? 'bg-accent/70' :
            'bg-white/10',
        ]">
          <div
            class="border-4 border-white/25 text-white/70 border-dotted w-full h-full mx-auto text-center flex items-center gap-2">
            <div class="mx-auto">
              <Icon icon="mdi:parking" width="24" height="24" />
              <div class="text-xs text-white/50 absolute left-0 bottom-2 mx-auto w-full">
                <span>{{ indexRow }}{{ indexCol }}</span>
              </div>
            </div>
          </div>
        </button>
        <div v-if="col == `EMPTY`" :class="`w-16 aspect-square text-center bg-transparent flex items-center gap-2`">
        </div>
        <div v-if="col == `ROAD`" :class="`w-16 aspect-square text-center bg-white/10 flex items-center gap-2`">
        </div>
        <div v-if="col == `IN`"
          :class="`w-16 aspect-square text-center bg-green-200 text-green-500 font-semibold flex items-center gap-2`">
          <div class="mx-auto">
            {{ col }}
          </div>
        </div>
        <div v-if="col == `DOOR`"
          :class="`w-16 aspect-square text-center bg-green-500 text-green-200 font-semibold flex items-center gap-2`">
          <div class="mx-auto">
            {{ col }}
          </div>
        </div>
        <div v-if="col == `EXIT`"
          :class="`w-16 aspect-square text-center bg-red-200 text-red-500 font-semibold flex items-center gap-2`">
          <div class="mx-auto">
            {{ col }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- End Parking Layout -->
</template>