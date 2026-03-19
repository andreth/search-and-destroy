<template>
  <header class="topbar">
    <div class="topbar__left">
      <div class="brand">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span>Command Center</span>
      </div>
      <div class="topbar__signal">
        <span class="signal-bar signal-bar--1" />
        <span class="signal-bar signal-bar--2" />
        <span class="signal-bar signal-bar--3" />
        <span class="signal-bar signal-bar--4" />
        <span class="signal-label">SECURE</span>
      </div>
    </div>

    <div class="topbar__divider" />

    <div class="resources">
      <div v-for="r in resources" :key="r.label" class="resource">
        <span class="resource-label">{{ r.label }}</span>
        <span class="resource-value">{{ r.value }}</span>
      </div>
    </div>

    <div class="topbar__divider" />

    <div class="topbar__right">
      <div class="topbar__clock">
        <span class="clock-label">UTC</span>
        <span class="clock-value">{{ clock }}</span>
      </div>

      <div class="operative-wrapper">
        <div v-if="xpProgress" class="operative-xp-row">
          <XpBar
            :current-xp="xpProgress.currentXp"
            :next-level-xp="xpProgress.nextLevelXp"
            :progress="xpProgress.progress"
            :show-labels="false"
            :show-percent="false"
            size="sm"
          />
          <span class="operative-xp-text">{{ xpProgress.currentXp }} / {{ xpProgress.nextLevelXp }} XP</span>
        </div>
        <button type="button" class="operative-block" @click="menuOpen = !menuOpen">
          <img
            v-if="levelImageUrl"
            :src="levelImageUrl"
            :alt="levelLabel"
            class="operative-level-logo"
          />
          <div v-else class="operative-level-placeholder" :title="levelLabel">R</div>
          <div class="operative-info">
            <div class="operative-row">
              <span class="operative-label">Operative</span>
              <span class="operative-value">{{ pseudo }}</span>
            </div>
            <div class="operative-row">
              <span class="operative-label">Rank</span>
              <span class="operative-value rank">{{ levelLabel }}</span>
            </div>
          </div>
          <svg class="operative-chevron" :class="{ 'operative-chevron--open': menuOpen }" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <polyline points="4 6 8 10 12 6" />
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="menuOpen" class="operative-dropdown" @click="menuOpen = false">
            <button type="button" class="dropdown-item" @click="$emit('settings')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              <span>Paramètres</span>
            </button>
            <div class="dropdown-sep" />
            <button type="button" class="dropdown-item dropdown-item--danger" @click="$emit('logout')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Déconnexion</span>
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
export interface ResourceItem {
  label: string
  value: string
}
</script>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import XpBar from '@/components/ui/XpBar.vue'

defineProps<{
  resources?: ResourceItem[]
}>()

defineEmits<{
  settings: []
  logout: []
}>()

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')
const authStore = useAuthStore()
const pseudo = computed(() => authStore.user?.username ?? '–')
const levelLabel = computed(() => authStore.user?.Level?.name ?? `Niveau ${authStore.user?.Level?.levelNumber ?? 1}`)
const levelImageUrl = computed(() => {
  const img = authStore.user?.Level?.image
  return img ? `${API_URL}/uploads/${img}` : null
})

const XP_FALLBACK = { currentXp: 0, currentLevelXp: 0, nextLevelXp: 500, progress: 0, currentLevel: 1, currentLevelName: 'Niveau 1', nextLevelName: 'Niveau 2' }
const xpProgress = computed(() => {
  try {
    return authStore.xpProgress ?? XP_FALLBACK
  } catch {
    return XP_FALLBACK
  }
})
const menuOpen = ref(false)

function handleClickOutside(e: MouseEvent) {
  const wrapper = (e.target as HTMLElement).closest('.operative-wrapper')
  if (!wrapper) menuOpen.value = false
}

const clock = ref('')
let clockInterval: ReturnType<typeof setInterval> | null = null

function updateClock() {
  const now = new Date()
  clock.value = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
header {
  background: linear-gradient(180deg, #141210, #0a0908);
  box-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.topbar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(196, 168, 130, 0.1);
  background: linear-gradient(180deg, #131110, #0c0b09);
  gap: 16px;
}
.topbar__left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #C4A882;
  white-space: nowrap;
  animation: brand-pulse 3s ease-in-out infinite;
}
.brand-icon {
  width: 18px;
  height: 18px;
  stroke: #C4A882;
  opacity: 0.7;
  animation: brand-icon-glow 3s ease-in-out infinite;
}

@keyframes brand-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
@keyframes brand-icon-glow {
  0%, 100% { filter: drop-shadow(0 0 0px transparent); opacity: 0.7; }
  50% { filter: drop-shadow(0 0 4px rgba(196, 168, 130, 0.4)); opacity: 1; }
}

/* Signal indicator */
.topbar__signal {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 2px 0;
}
.signal-bar {
  width: 3px;
  border-radius: 1px;
  background: rgba(74, 222, 128, 0.7);
  animation: signal-wave 2s ease-in-out infinite;
}
.signal-bar--1 { height: 6px;  animation-delay: 0s; }
.signal-bar--2 { height: 9px;  animation-delay: 0.15s; }
.signal-bar--3 { height: 12px; animation-delay: 0.3s; }
.signal-bar--4 { height: 15px; animation-delay: 0.45s; }

@keyframes signal-wave {
  0%, 100% { opacity: 0.4; box-shadow: none; }
  50% { opacity: 1; box-shadow: 0 0 4px rgba(74, 222, 128, 0.5); }
}

.signal-label {
  font-size: 8px;
  letter-spacing: 0.15em;
  color: rgba(74, 222, 128, 0.5);
  margin-left: 4px;
  align-self: center;
  animation: signal-label-blink 4s step-end infinite;
}

@keyframes signal-label-blink {
  0%, 90% { opacity: 1; }
  92% { opacity: 0; }
  94% { opacity: 1; }
  96% { opacity: 0; }
  98%, 100% { opacity: 1; }
}

/* Dividers */
.topbar__divider {
  width: 1px;
  height: 28px;
  background: linear-gradient(180deg, transparent, rgba(196, 168, 130, 0.15), transparent);
  flex-shrink: 0;
}

/* Resources */
.resources {
  display: flex;
  gap: 20px;
  font-size: 12px;
  flex: 1;
  justify-content: center;
}
.resource {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 4px 12px;
  border: 1px solid rgba(196, 168, 130, 0.06);
  background: rgba(0, 0, 0, 0.2);
}
.resource-label {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(196, 168, 130, 0.5);
}
.resource-value {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(212, 197, 169, 0.95);
  font-variant-numeric: tabular-nums;
}

/* Right section */
.topbar__right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

/* Clock */
.topbar__clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 2px 10px;
}
.clock-label {
  font-size: 7px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(74, 222, 128, 0.4);
}
.clock-value {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: rgba(74, 222, 128, 0.7);
  font-variant-numeric: tabular-nums;
}

/* Operative wrapper */
.operative-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* XP bar above operative block */
.operative-xp-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.operative-xp-text {
  font-size: 8px;
  letter-spacing: 0.1em;
  color: rgba(74, 222, 128, 0.5);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.operative-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 8px;
  border: 1px solid rgba(196, 168, 130, 0.2);
  border-left-width: 3px;
  background: rgba(0, 0, 0, 0.35);
  min-width: 130px;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.operative-block:hover {
  border-color: rgba(196, 168, 130, 0.35);
  background: rgba(0, 0, 0, 0.5);
}

.operative-chevron {
  width: 14px;
  height: 14px;
  stroke: rgba(196, 168, 130, 0.5);
  flex-shrink: 0;
  transition: transform 0.2s ease;
  margin-left: 2px;
}
.operative-chevron--open {
  transform: rotate(180deg);
}

/* Dropdown menu */
.operative-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 180px;
  padding: 6px 0;
  background: linear-gradient(180deg, #1a1814, #0e0d0a);
  border: 1px solid rgba(196, 168, 130, 0.2);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
  z-index: 50;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(212, 197, 169, 0.9);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}
.dropdown-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.7;
}
.dropdown-item:hover {
  background: rgba(196, 168, 130, 0.08);
  color: #C4A882;
}
.dropdown-item--danger:hover {
  background: rgba(248, 113, 113, 0.08);
  color: #fca5a5;
}
.dropdown-sep {
  height: 1px;
  background: rgba(196, 168, 130, 0.1);
  margin: 4px 10px;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.operative-level-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid rgba(196, 168, 130, 0.25);
  flex-shrink: 0;
}
.operative-level-placeholder {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1px solid rgba(196, 168, 130, 0.3);
  background: rgba(196, 168, 130, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: rgba(196, 168, 130, 0.6);
  letter-spacing: 0.02em;
}
.operative-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.operative-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 10px;
  letter-spacing: 0.1em;
}
.operative-label {
  text-transform: uppercase;
  color: rgba(196, 168, 130, 0.6);
  font-size: 8px;
}
.operative-value {
  color: rgba(212, 197, 169, 0.95);
  font-weight: 600;
  font-size: 11px;
}
.operative-value.rank {
  color: rgba(212, 169, 85, 0.95);
}
</style>
