<template>
  <div class="base-radar">
    <div class="base-radar__header">
      <span class="base-radar__label">SECTEUR BASE — CARTE</span>
      <span class="base-radar__status">CHAMP DE BATAILLE</span>
    </div>

    <div class="base-radar__viewport">
      <div class="base-radar__bg" />
      <div class="base-radar__grain" aria-hidden="true" />
      <div class="base-radar__grid-lines" />
      <div class="base-radar__grid-circles" />
      <div class="base-radar__glow" />

      <button
        v-for="b in buildings"
        :key="b.id"
        type="button"
        class="base-radar__marker"
        :class="{ 'base-radar__marker--locked': !isUnlocked(b.levelRequired) }"
        :style="{ left: b.mapX + '%', top: b.mapY + '%' }"
        @click="$emit('select', b)"
      >
        <span class="base-radar__marker-code">{{ b.code }}</span>
        <div class="base-radar__tooltip" role="tooltip">
          <div class="base-radar__tooltip-name">{{ b.name }}</div>
          <div class="base-radar__tooltip-level">Niveau {{ b.levelRequired }}</div>
          <div class="base-radar__tooltip-production">{{ b.production }}</div>
        </div>
      </button>

      <div class="base-radar__corner base-radar__corner--tl" />
      <div class="base-radar__corner base-radar__corner--tr" />
      <div class="base-radar__corner base-radar__corner--bl" />
      <div class="base-radar__corner base-radar__corner--br" />
    </div>

    <div class="base-radar__footer">
      <span>GRID BASE-01</span>
      <span class="base-radar__blink">TRACK</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BuildingDef } from '@/data/buildings'

defineProps<{
  buildings: BuildingDef[]
  isUnlocked: (levelRequired: number) => boolean
}>()

defineEmits<{
  select: [building: BuildingDef]
}>()
</script>

<style scoped>
.base-radar {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.base-radar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 10px;
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-left-width: 3px;
  background: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(74, 222, 128, 0.9);
}

.base-radar__status {
  color: rgba(74, 222, 128, 0.6);
  font-weight: 600;
}

.base-radar__viewport {
  position: relative;
  flex: 1;
  min-height: 0;
  background: #0a0e0c;
  border: 1px solid rgba(74, 222, 128, 0.12);
  overflow: hidden;
}

.base-radar__bg,
.base-radar__grain,
.base-radar__grid-lines,
.base-radar__grid-circles,
.base-radar__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Terrain militaire vert sombre */
.base-radar__bg {
  background:
    radial-gradient(ellipse 120% 80% at 70% 60%, rgba(28, 35, 28, 0.5) 0%, transparent 50%),
    radial-gradient(ellipse 80% 100% at 20% 80%, rgba(22, 28, 22, 0.6) 0%, transparent 45%),
    radial-gradient(ellipse 60% 70% at 80% 25%, rgba(18, 24, 18, 0.4) 0%, transparent 40%),
    linear-gradient(180deg, #0e1310 0%, #0a0e0c 40%, #080c0a 70%, #060a08 100%);
}

/* Grain / texture champ de bataille */
.base-radar__grain {
  opacity: 0.14;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
}

.base-radar__grid-lines {
  background-image:
    linear-gradient(to right, rgba(74, 222, 128, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(74, 222, 128, 0.05) 1px, transparent 1px);
  background-size: 12% 12%;
}

.base-radar__grid-circles {
  background-image:
    radial-gradient(circle at center, transparent 15%, rgba(74, 222, 128, 0.06) 15%, transparent 30%),
    radial-gradient(circle at center, transparent 30%, rgba(74, 222, 128, 0.06) 30%, transparent 45%),
    radial-gradient(circle at center, transparent 45%, rgba(74, 222, 128, 0.04) 45%, transparent 60%);
}

.base-radar__glow {
  background: radial-gradient(
    circle at 50% 50%,
    transparent 50%,
    rgba(74, 222, 128, 0.04) 80%,
    transparent 100%
  );
}

.base-radar__marker {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid rgba(196, 168, 130, 0.5);
  background: rgba(12, 11, 9, 0.95);
  box-shadow:
    0 0 10px rgba(196, 168, 130, 0.2),
    inset 0 0 10px rgba(196, 168, 130, 0.04);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.base-radar__marker:hover {
  transform: translate(-50%, -50%) scale(1.08);
  box-shadow: 0 0 14px rgba(212, 169, 85, 0.35);
  border-color: rgba(212, 169, 85, 0.8);
}

.base-radar__marker--locked {
  border-color: rgba(107, 114, 128, 0.4);
  box-shadow: none;
  opacity: 0.8;
  cursor: default;
}

.base-radar__marker--locked:hover {
  transform: translate(-50%, -50%);
  box-shadow: none;
}

.base-radar__marker-code {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(196, 168, 130, 0.95);
}

.base-radar__marker--locked .base-radar__marker-code {
  color: rgba(107, 114, 128, 0.9);
}

/* Tooltip personnalisé */
.base-radar__tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  padding: 10px 12px;
  min-width: 180px;
  background: linear-gradient(180deg, #1a1814, #0e0d0a);
  border: 1px solid rgba(196, 168, 130, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0.15s ease, transform 0.15s ease;
  z-index: 10;
}

.base-radar__marker:hover .base-radar__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.base-radar__tooltip-name {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(209, 213, 219, 0.98);
  margin-bottom: 4px;
}

.base-radar__tooltip-level {
  font-size: 10px;
  letter-spacing: 0.06em;
  color: rgba(212, 169, 85, 0.9);
  margin-bottom: 2px;
}

.base-radar__tooltip-production {
  font-size: 10px;
  letter-spacing: 0.04em;
  color: rgba(156, 163, 175, 0.95);
}

.base-radar__corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: rgba(74, 222, 128, 0.5);
  border-style: solid;
  border-width: 0;
  pointer-events: none;
}

.base-radar__corner--tl { top: 4px;  left: 4px;  border-top-width: 2px; border-left-width: 2px; }
.base-radar__corner--tr { top: 4px;  right: 4px; border-top-width: 2px; border-right-width: 2px; }
.base-radar__corner--bl { bottom: 4px; left: 4px;  border-bottom-width: 2px; border-left-width: 2px; }
.base-radar__corner--br { bottom: 4px; right: 4px; border-bottom-width: 2px; border-right-width: 2px; }

.base-radar__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 4px 10px;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: rgba(74, 222, 128, 0.5);
}

.base-radar__blink {
  animation: base-radar-blink 1.2s step-end infinite;
  color: rgba(250, 204, 21, 0.8);
}

@keyframes base-radar-blink {
  50% { opacity: 0.4; }
}
</style>
