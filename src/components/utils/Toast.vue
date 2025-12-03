<template>
  <div class="fixed bottom-6 right-6 space-y-3 z-50">
    <div
      v-for="(toast, i) in toasts"
      :key="i"
      class="bg-gray-800 text-white px-4 py-3 rounded-xl shadow-lg">
        {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToast } from '@/composables/use-toast'
  const { toasts } = useToast()
</script>
