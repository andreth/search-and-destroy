<script setup lang="ts">
import { computed } from 'vue'
import Google from '@/assets/images/svgs/google-icon.svg'

defineProps<{
  title?: string
}>()

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '')
const googleAuthUrl = computed(() => {
  const base = API_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const from = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''
  return `${base}/api/auth/google${from ? `?from=${from}` : ''}`
})
</script>

<template>
  <div>
    <div class="flex justify-center my-6">
      <a
        :href="googleAuthUrl"
        class="px-4 py-2.5 border border-ld flex gap-2 items-center w-full rounded-md text-center justify-center text-ld text-primary-ld hover:opacity-90"
      >
        <img :src="Google" alt="Google" height="18" width="18" /> Google
      </a>
    </div>

    <div className="flex items-center justify-center gap-2">
      <hr className="grow border-ld" />
      <p className="text-base text-ld font-medium">{{ title }}</p>
      <hr className="grow border-ld" />
    </div>
  </div>
</template>
