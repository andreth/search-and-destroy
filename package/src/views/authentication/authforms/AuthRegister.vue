<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import Label from '@/components/ui/label/Label.vue'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const router = useRouter()
const authStore = useAuthStore()
// En dev : même origine → Vite proxy. En prod : VITE_API_URL.
const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')

async function onSubmit(e: Event) {
  e.preventDefault()
  error.value = null
  loading.value = true

  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      email: email.value,
      password: password.value
    })

    const token = response.data
    authStore.setToken(token)
    await router.push('/')
  } catch (err: any) {
    const msg = err?.response?.data?.error
    error.value = typeof msg === 'string' ? msg : 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit="onSubmit" class="mt-6">
    <div class="mb-4">
      <div className="mb-2 block">
        <Label for="emadd" class="font-semibold">Email Address</Label>
      </div>
      <Input id="emadd" type="email" v-model="email" class="form-control" required />
    </div>

    <div class="mb-6">
      <div className="mb-2 block">
        <Label for="userpwd" class="font-semibold">Password</Label>
      </div>
      <Input id="userpwd" type="password" v-model="password" class="form-control" required />
    </div>

    <div v-if="error" class="text-red-500 text-sm mb-4">
      {{ error }}
    </div>
    <Button type="submit" class="w-full" :disabled="loading">
      <span v-if="loading">Inscription...</span>
      <span v-else>Sign Up</span>
    </Button>
  </form>
</template>
