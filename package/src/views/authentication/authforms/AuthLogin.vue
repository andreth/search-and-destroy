<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/button/Button.vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import Label from '@/components/ui/label/Label.vue'
import { Input } from '@/components/ui/input'

const email = ref('')
const password = ref('')
const rememberDevice = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
// En dev : même origine → Vite proxy. En prod : VITE_API_URL.
const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')

async function onSubmit(event: Event) {
  event.preventDefault()
  error.value = null
  loading.value = true

  try {
    const response = await axios.post(`${API_URL}/api/auth/signin/local`, {
      email: email.value,
      password: password.value
    })

    const token = response.data
    authStore.setToken(token)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch (err: any) {
    if (err?.response?.status === 401) {
      error.value = err.response.data || 'Identifiants invalides'
    } else {
      error.value = 'Erreur lors de la connexion'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit="onSubmit" class="mt-6">
    <div class="mb-4">
      <div className="mb-2 block">
        <Label for="email">Email</Label>
      </div>
      <Input id="email" type="email" v-model="email" class="form-control" required />
    </div>

    <div class="mb-4">
      <div className="mb-2 block">
        <Label for="userpwd">Password</Label>
      </div>
      <Input id="userpwd" type="password" v-model="password" class="form-control" />
    </div>

    <div class="flex justify-between my-5 items-center">
      <div class="flex items-center gap-2">
        <Checkbox id="accept" v-model="rememberDevice" class="checkbox" />
        <Label for="accept" class="opacity-90 font-normal cursor-pointer">
          Remeber this Device
        </Label>
      </div>
      <RouterLink to="#" class="text-primary text-sm font-medium">
        Forgot Password?
      </RouterLink>
    </div>
    <div v-if="error" class="text-red-500 text-sm mb-4">
      {{ error }}
    </div>
    <Button class="w-full" type="submit" :disabled="loading">
      <span v-if="loading">Signing in...</span>
      <span v-else>Sign in</span>
    </Button>
  </form>
</template>
