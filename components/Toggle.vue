<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  label?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

function toggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <button type="button" @click="toggle"
      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand/50"
      :class="modelValue ? 'bg-brand' : 'bg-gray-200'">
      <span class="sr-only">Toggle camera view</span>
      <span
        class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"></span>
    </button>
    <span v-if="label" class="text-sm font-medium">{{ label }}</span>
  </div>
</template>
