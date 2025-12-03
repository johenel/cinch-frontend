import { ref } from 'vue'

export interface ToastOptions {
  message: string
  duration?: number
}

const toasts = ref<ToastOptions[]>([])

export function useToast() {
  function showToast(options: ToastOptions) {
    toasts.value.push(options)
    const index = toasts.value.length - 1

    setTimeout(() => {
      toasts.value.splice(index, 1)
    }, options.duration || 3000)
  }

  return { toasts, showToast }
}
