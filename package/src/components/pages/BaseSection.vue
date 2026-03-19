<template>
  <section class="base-section">
    <header class="base-section__header">
      <div>
        <p class="base-section__label">Secteur base</p>
        <h2 class="base-section__title">Bâtiments</h2>
        <p class="base-section__level">
          Niveau actuel : <strong>{{ playerLevel }}</strong> — {{ unlockedCount }}/{{ buildings.length }} débloqués
        </p>
      </div>
    </header>

    <div class="base-section__layout">
      <aside class="base-section__cards-col">
        <BunkerPanel paddingClass="p-4">
          <h3 class="base-section__panel-title">Catalogue des installations</h3>
          <div class="base-section__cards-scroll">
            <BuildingCard
              v-for="b in buildings"
              :key="b.id"
              :building="b"
              :unlocked="isUnlocked(b.levelRequired)"
              @build="onBuild(b)"
              @fiche="openFiche(b)"
            />
          </div>
        </BunkerPanel>
      </aside>

      <div class="base-section__map-col">
        <BaseRadarMap
          :buildings="buildings"
          :is-unlocked="isUnlocked"
          @select="openFiche"
        />
      </div>
    </div>

    <BuildingFiche
      v-if="selectedBuilding"
      :building="selectedBuilding"
      @close="selectedBuilding = null"
      @build="onBuild(selectedBuilding); selectedBuilding = null"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { BuildingDef } from '@/data/buildings'
import { BUILDINGS } from '@/data/buildings'
import BunkerPanel from '../ui/BunkerPanel.vue'
import BuildingCard from '../ui/BuildingCard.vue'
import BaseRadarMap from '../ui/BaseRadarMap.vue'
import BuildingFiche from '../ui/BuildingFiche.vue'

defineProps<{
  missions?: Array<string>
}>()

const authStore = useAuthStore()

const buildings = BUILDINGS
const selectedBuilding = ref<BuildingDef | null>(null)

const playerLevel = computed(() => authStore.user?.Level?.levelNumber ?? 1)

function isUnlocked(levelRequired: number): boolean {
  return playerLevel.value >= levelRequired
}

const unlockedCount = computed(() =>
  buildings.filter((b) => isUnlocked(b.levelRequired)).length
)

function openFiche(building: BuildingDef) {
  selectedBuilding.value = building
}

function onBuild(building: BuildingDef) {
  // TODO: brancher API construction
  console.log('Build', building.id, building.name)
}
</script>

<style scoped>
.base-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.base-section__header {
  padding: 4px 0;
  flex-shrink: 0;
}

.base-section__label {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(107, 114, 128, 0.9);
}

.base-section__title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(196, 168, 130, 0.9);
  margin: 4px 0 6px 0;
}

.base-section__level {
  font-size: 11px;
  color: rgba(156, 163, 175, 0.9);
}

.base-section__level strong {
  color: rgba(212, 169, 85, 0.95);
}

.base-section__layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

@media (max-width: 900px) {
  .base-section__layout {
    grid-template-columns: 1fr;
  }
}

.base-section__cards-col {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.base-section__cards-col .bunker-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.base-section__panel-title {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(196, 168, 130, 0.75);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(196, 168, 130, 0.08);
  flex-shrink: 0;
}

.base-section__cards-scroll {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.base-section__cards-scroll::-webkit-scrollbar {
  width: 6px;
}

.base-section__cards-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.base-section__cards-scroll::-webkit-scrollbar-thumb {
  background: rgba(196, 168, 130, 0.2);
  border-radius: 3px;
}

.base-section__map-col {
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
