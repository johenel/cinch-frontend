<script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue'

  const props = defineProps<{ open: boolean }>()
  const emit = defineEmits<{
    (e: 'close'): void
  }>()

  function close() {
    emit('close')
  }
</script>

<template>
  <div v-if="open" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-white rounded-md shadow-xl p-6 w-full max-w-md relative">
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="close"
      >
        ✕
      </button>
      <div class="pt-8 pb-2">
        <slot />
      </div>
    </div>
  </div>
</template>





<style scoped>
</style>
