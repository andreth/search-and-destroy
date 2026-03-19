<script setup lang="ts">
import { ref, onMounted, shallowRef, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Modern from '@/views/dashboards/Modern.vue'
import PlayerHome from '@/views/player/PlayerHome.vue'

const router = useRouter()
const authStore = useAuthStore()

const component = shallowRef<typeof Modern | typeof PlayerHome | null>(null)
const loading = ref(true)

onMounted(async () => {
  if (!authStore.token) {
    router.replace('/auth/login2').catch(() => {})
    loading.value = false
    return
  }
  const user = await authStore.fetchMe()
  // Ne jamais afficher l'admin par défaut : si on n'a pas pu charger l'utilisateur, rediriger vers login
  if (!user) {
    router.replace('/auth/login2').catch(() => {})
    loading.value = false
    return
  }
  if (authStore.isPlayer) {
    component.value = markRaw(PlayerHome)
  } else {
    component.value = markRaw(Modern)
  }
  loading.value = false
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-20">
    <p class="text-muted-foreground">Chargement...</p>
  </div>
  <component v-else-if="component" :is="component" />
</template>
