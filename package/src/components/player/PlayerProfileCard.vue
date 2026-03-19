<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/components/ui/card'

/**
 * Carte réutilisable affichant le pseudo d'un joueur, son niveau avec l'icône du rang et le nom du rang.
 * Peut être utilisée sur la page d'accueil joueur, dans un profil, un classement, etc.
 */
const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')

export interface PlayerLevel {
  id: number
  levelNumber: number
  name: string
  image?: string | null
}

export interface PlayerProfileCardUser {
  username: string
  Level?: PlayerLevel | null
}

const props = withDefaults(
  defineProps<{
    user: PlayerProfileCardUser
    /** Afficher une version plus compacte (ex. dans une liste) */
    compact?: boolean
  }>(),
  { compact: false }
)

const displayName = computed(() => props.user?.username || 'Joueur')

const levelName = computed(() => {
  const l = props.user?.Level
  if (!l?.name) return 'Niveau 1'
  return l.name
})

function levelImageUrl(): string | null {
  const img = props.user?.Level?.image
  if (!img) return null
  const base = API_URL || ''
  return `${base}/uploads/${img}`
}
</script>

<template>
  <Card
    class="overflow-hidden border-white/10 bg-slate-900/60 text-slate-100 shadow-2xl shadow-black/30 backdrop-blur-md"
    :class="compact ? 'p-4' : 'p-6'"
  >
    <div class="flex items-center gap-4">
      <div
        v-if="levelImageUrl()"
        class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-950/50 ring-2 ring-cyan-300/20"
      >
        <img
          :src="levelImageUrl()!"
          :alt="levelName"
          class="h-full w-full object-cover"
        />
      </div>
      <div v-else class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950/50 text-2xl text-slate-400">
        🎮
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm text-slate-400">
          {{ compact ? 'Mon profil' : 'Bienvenue' }}
        </p>
        <h2 class="text-xl font-semibold truncate">
          {{ displayName }}
        </h2>
        <div class="flex items-center gap-2 mt-1">
          <span
            v-if="levelImageUrl()"
            class="inline-flex h-6 w-6 rounded overflow-hidden shrink-0"
          >
            <img :src="levelImageUrl()!" :alt="levelName" class="h-full w-full object-cover" />
          </span>
          <span class="text-sm font-semibold text-cyan-200">
            {{ levelName }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>
