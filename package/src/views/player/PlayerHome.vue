<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppShell from '@/components/hud/AppShell.vue'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

onMounted(async () => {
  if (!authStore.token) return
  if (!authStore.user) {
    await authStore.fetchMe()
  }
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center py-12">
    <p class="text-muted-foreground">Chargement...</p>
  </div>
  <div v-else-if="error" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
    {{ error }}
  </div>
  <div v-else-if="!user && !authStore.token" class="rounded-lg border border-muted p-4 text-muted-foreground">
    Non connecté.
  </div>
  <AppShell v-else />
</template>
