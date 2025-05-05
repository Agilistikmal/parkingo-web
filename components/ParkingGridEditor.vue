<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  modelValue?: string[][];
}>();

const rows = 6;
const cols = 9;

const layout = ref<string[][]>(
  Array.from({ length: rows }, () => Array(cols).fill("EMPTY"))
);

onMounted(() => {
  if (props.modelValue) {
    layout.value = props.modelValue.map(row => [...row]);
  }
});

const selectedType = ref("P");
const isMouseDown = ref(false);

function setCell(row: number, col: number) {
  layout.value[row][col] = selectedType.value;
}

function handleDrag(row: number, col: number) {
  if (isMouseDown.value) {
    setCell(row, col);
  }
}

function mouseDown(row: number, col: number) {
  isMouseDown.value = true;
  setCell(row, col);
}

function mouseUp() {
  isMouseDown.value = false;
}

defineExpose({
  getLayout: () => layout.value
});

</script>

<template>
  <div class="space-y-4 select-none" @mouseup="mouseUp">
    <!-- Tipe Selector -->
    <div class="flex flex-wrap gap-2">
      <div v-for="type in ['P', 'ROAD', 'DOOR', 'EXIT', 'IN', 'EMPTY']" :key="type"
        class="px-4 py-1 rounded-md border text-sm cursor-pointer"
        :class="{ 'bg-blue-600 text-white': selectedType === type }" @click="selectedType = type">
        {{ type }}
      </div>
    </div>

    <!-- Grid -->
    <div class="grid gap-1 justify-center" :style="{ gridTemplateColumns: `repeat(${cols}, 40px)` }">
      <div v-for="(row, i) in layout" :key="i" class="contents">
        <div v-for="(cell, j) in row" :key="j"
          class="w-10 h-10 flex items-center justify-center border text-xs font-bold cursor-pointer" :class="{
            'bg-green-600 text-white': cell === 'DOOR',
            'bg-red-400 text-white': cell === 'EXIT',
            'bg-yellow-400': cell === 'IN',
            'bg-white text-black': cell === 'ROAD',
            'bg-gray-800 text-white border-dashed': cell === 'P',
            'bg-transparent border-gray-400': cell === 'EMPTY',
          }" @mousedown.prevent="mouseDown(i, j)" @mouseover.prevent="handleDrag(i, j)">
          {{ cell === 'EMPTY' ? '' : cell }}
        </div>
      </div>
    </div>

    <!-- Preview -->
    <!-- <div>
            <h3 class="font-semibold">Layout JSON</h3>
            <pre class="bg-black text-white p-3 rounded-xl text-xs overflow-auto">
{{ JSON.stringify(layout, null, 2) }}
      </pre>
        </div> -->
  </div>
</template>
