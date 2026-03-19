<template>
  <div class="building-fiche-overlay" @click.self="$emit('close')">
    <div class="building-fiche">
      <div class="building-fiche__head">
        <h3 class="building-fiche__title">{{ building.name }}</h3>
        <button type="button" class="building-fiche__close" aria-label="Fermer" @click="$emit('close')">×</button>
      </div>
      <dl class="building-fiche__grid">
        <dt>Code</dt>
        <dd>{{ building.code }}</dd>
        <dt>Niveau</dt>
        <dd>{{ building.levelRequired }}</dd>
        <dt>Production</dt>
        <dd>{{ building.production }}</dd>
        <dt>Description</dt>
        <dd class="building-fiche__desc">{{ building.description }}</dd>
      </dl>
      <div class="building-fiche__footer">
        <MilitaryButton variant="secondary" type="button" @click="$emit('build')">
          Construire / Améliorer
        </MilitaryButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BuildingDef } from '@/data/buildings'
import MilitaryButton from './MilitaryButton.vue'

defineProps<{
  building: BuildingDef
}>()

defineEmits<{
  close: []
  build: []
}>()
</script>

<style scoped>
.building-fiche-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 24px;
}

.building-fiche {
  width: 100%;
  max-width: 400px;
  padding: 20px 24px;
  background: linear-gradient(180deg, #1a1814 0%, #0e0d0a 100%);
  border: 1px solid rgba(196, 168, 130, 0.25);
  border-left-width: 4px;
  box-shadow:
    inset 0 1px 0 rgba(196, 168, 130, 0.04),
    0 24px 48px rgba(0, 0, 0, 0.8);
}

.building-fiche__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(196, 168, 130, 0.08);
}

.building-fiche__title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(209, 213, 219, 0.98);
  margin: 0;
}

.building-fiche__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 24px;
  line-height: 1;
  color: rgba(156, 163, 175, 0.9);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.building-fiche__close:hover {
  color: rgba(212, 169, 85, 0.95);
  border-color: rgba(196, 168, 130, 0.3);
}

.building-fiche__grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px 16px;
  font-size: 12px;
  margin: 0 0 16px 0;
}

.building-fiche__grid dt {
  color: rgba(107, 114, 128, 0.95);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.building-fiche__grid dd {
  margin: 0;
  color: rgba(209, 213, 219, 0.95);
}

.building-fiche__desc {
  grid-column: 1 / -1;
  line-height: 1.45;
  color: rgba(156, 163, 175, 0.95);
}

.building-fiche__footer {
  padding-top: 12px;
  border-top: 1px solid rgba(196, 168, 130, 0.08);
}
</style>
