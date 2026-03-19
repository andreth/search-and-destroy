<script setup lang="ts">
import { computed } from 'vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'
import LayoutVerticalSidebar from './vertical-sidebar/VerticalSidebar.vue'
import LayoutVerticalHeader from './vertical-header/VerticalHeader.vue'

const authStore = useAuthStore()
const isPlayer = computed(() => authStore.isPlayer)
</script>

<template>
  <!-- Joueur : uniquement le contenu (HUD), sans sidebar ni header -->
  <template v-if="isPlayer">
    <RouterView />
  </template>

  <!-- Admin / non joueur : layout complet avec sidebar et header -->
  <SidebarProvider v-else>
    <div class="flex w-full min-h-screen">
      <div class="flex">
        <LayoutVerticalSidebar />
      </div>
      <div class="w-full bg-white dark:bg-dark">
        <LayoutVerticalHeader />
        <main class="flex-grow">
          <div class="container mx-auto py-[30px] px-6">
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
</template>
