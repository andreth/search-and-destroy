<template>
  <div class="min-h-screen bg-[#0c0b09] text-gray-200 font-mono hud-root">
    <div class="hud-bg" aria-hidden="true">
      <div class="hud-bg-grid" />
      <div class="hud-bg-scanlines" />
      <div class="hud-bg-noise" />
      <div class="hud-bg-vignette" />
      <div class="hud-bg-scanbar" />
    </div>

    <!-- HUD corners -->
    <div class="hud-corner hud-corner--tl" aria-hidden="true" />
    <div class="hud-corner hud-corner--tr" aria-hidden="true" />
    <div class="hud-corner hud-corner--bl" aria-hidden="true" />
    <div class="hud-corner hud-corner--br" aria-hidden="true" />

    <!-- Coordinates -->
    <div class="hud-coords hud-coords--bl" aria-hidden="true">
      <span>LAT 48.8566°N</span>
      <span>LON 2.3522°E</span>
    </div>
    <div class="hud-coords hud-coords--br" aria-hidden="true">
      <span>GRID 44-72-A</span>
      <span>ALT 142m</span>
    </div>

    <div class="hud-foreground">
      <CommandTopBar :resources="resources" @settings="onSettings" @logout="onLogout" />

      <div class="flex flex-1 min-h-0">
        <MilitarySideNav v-model="activeSection" :items="menu" />

        <main class="flex-1 flex flex-col min-h-0 overflow-hidden p-6 main-content">
          <template v-if="activeSection === 'base'">
            <BaseSection :missions="missions" />
          </template>
          <ArmySection v-else-if="activeSection === 'army'" :units="units" />
          <TechSection v-else-if="activeSection === 'tech'" :tech="tech" />
          <ProfileSection v-else-if="activeSection === 'profile'" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { router } from '@/router'
import CommandTopBar from '@/components/layout/CommandTopBar.vue'
import MilitarySideNav from '@/components/layout/MilitarySideNav.vue'
import BaseSection from '@/components/pages/BaseSection.vue'
import ArmySection from '@/components/pages/ArmySection.vue'
import TechSection from '@/components/pages/TechSection.vue'
import ProfileSection from '@/components/pages/ProfileSection.vue'

const authStore = useAuthStore()
const activeSection = ref<'base' | 'army' | 'tech' | 'profile'>('base')

const resources = [
  { label: 'Acier', value: '1.2M' },
  { label: 'Pétrole', value: '800K' },
  { label: 'Uranium', value: '2.1K' }
]

const menu = [
  { key: 'base', label: 'Base' },
  { key: 'army', label: 'Armée' },
  { key: 'tech', label: 'Tech' }
]

const missions = ['Renforcer bunker', 'Déployer unité', 'Recherche avancée']
const units = ['Tank', 'Drone', 'Infanterie', 'AA']
const tech = ['Radar', 'Blindage', 'IA']

function onSettings() {
  activeSection.value = 'profile'
}

function onLogout() {
  authStore.logout()
  router.replace('/auth/login2').catch(() => {})
}
</script>

<style scoped>
.hud-root {
  position: relative;
  height: 100vh;
  max-height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.hud-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.hud-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(196, 168, 130, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(196, 168, 130, 0.025) 1px, transparent 1px);
  background-size: 60px 60px;
}
.hud-bg-scanlines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(74, 222, 128, 0.015) 2px,
    transparent 4px
  );
}
.hud-bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E");
}
.hud-bg-vignette {
  position: absolute;
  inset: -15%;
  background: radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, rgba(0, 0, 0, 0.65) 100%);
}
.hud-bg-scanbar {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(74, 222, 128, 0.08) 20%,
    rgba(74, 222, 128, 0.15) 50%,
    rgba(74, 222, 128, 0.08) 80%,
    transparent 100%
  );
  animation: hud-scanbar 6s ease-in-out infinite;
  opacity: 0.6;
}
@keyframes hud-scanbar {
  0% { top: -2px; }
  100% { top: 100%; }
}

/* HUD targeting corners */
.hud-corner {
  position: fixed;
  width: 28px;
  height: 28px;
  z-index: 10;
  pointer-events: none;
  border-color: rgba(74, 222, 128, 0.3);
  border-style: solid;
  border-width: 0;
}
.hud-corner--tl { top: 8px;  left: 8px;  border-top-width: 2px; border-left-width: 2px; }
.hud-corner--tr { top: 8px;  right: 8px; border-top-width: 2px; border-right-width: 2px; }
.hud-corner--bl { bottom: 8px; left: 8px;  border-bottom-width: 2px; border-left-width: 2px; }
.hud-corner--br { bottom: 8px; right: 8px; border-bottom-width: 2px; border-right-width: 2px; }

/* Coordinates overlay */
.hud-coords {
  position: fixed;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 9px;
  letter-spacing: 0.1em;
  font-family: 'Roboto Mono', monospace;
  color: rgba(74, 222, 128, 0.25);
}
.hud-coords--bl { bottom: 14px; left: 42px; }
.hud-coords--br { bottom: 14px; right: 42px; text-align: right; }
.hud-foreground {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.hud-foreground > :first-child {
  flex-shrink: 0;
}
.hud-foreground > div {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
.main-content {
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
