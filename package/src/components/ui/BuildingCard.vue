<template>
  <article
    class="building-card"
    :class="{ 'building-card--locked': !unlocked }"
    role="button"
    tabindex="0"
    @click="onCardClick"
    @keydown.enter="onCardClick"
  >
    <div class="building-card__header">
      <span class="building-card__code">{{ building.code }}</span>
      <span v-if="unlocked" class="building-card__badge">Débloqué</span>
      <span v-else class="building-card__req">Niv. {{ building.levelRequired }}</span>
    </div>
    <h4 class="building-card__name">{{ building.name }}</h4>
    <p class="building-card__desc">{{ building.description }}</p>
    <div v-if="unlocked" class="building-card__action" @click.stop>
      <MilitaryButton variant="secondary" type="button" @click="$emit('build')">
        Construire
      </MilitaryButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BuildingDef } from '@/data/buildings'
import MilitaryButton from './MilitaryButton.vue'

defineProps<{
  building: BuildingDef
  unlocked: boolean
}>()

const emit = defineEmits<{
  build: []
  fiche: []
}>()

function onCardClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.closest('.building-card__action')) return
  emit('fiche')
}
</script>

<style scoped>
.building-card {
  position: relative;
  padding: 14px 16px;
  background: linear-gradient(180deg, #1a1814 0%, #0e0d0a 100%);
  border: 1px solid rgba(196, 168, 130, 0.08);
  border-left: 3px solid rgba(196, 168, 130, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(196, 168, 130, 0.03),
    inset 0 -2px 8px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.4);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.building-card:hover {
  border-color: rgba(196, 168, 130, 0.18);
}

.building-card--locked {
  border-left-color: rgba(107, 114, 128, 0.4);
  opacity: 0.85;
}

.building-card--locked .building-card__name,
.building-card--locked .building-card__desc {
  color: rgba(156, 163, 175, 0.9);
}

.building-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.building-card__code {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(212, 169, 85, 0.75);
}

.building-card__badge {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(196, 168, 130, 0.9);
  padding: 2px 8px;
  border: 1px solid rgba(196, 168, 130, 0.25);
  background: rgba(196, 168, 130, 0.06);
}

.building-card__req {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: rgba(107, 114, 128, 0.9);
}

.building-card__name {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(212, 197, 169, 0.95);
  margin: 0 0 6px 0;
  text-transform: uppercase;
}

.building-card__desc {
  font-size: 11px;
  line-height: 1.4;
  color: rgba(156, 163, 175, 0.9);
  margin: 0 0 12px 0;
}

.building-card__action {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(196, 168, 130, 0.06);
}
</style>
