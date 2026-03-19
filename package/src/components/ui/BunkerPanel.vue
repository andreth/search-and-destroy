<template>
  <section class="bunker-panel" :class="paddingClass">
    <div class="tech-overlay"></div>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  paddingClass?: string
}>()
</script>

<style scoped>
.bunker-panel {
  position: relative;
  background:
    linear-gradient(180deg, #1a1814 0%, #14120f 30%, #0e0d0a 70%, #0a0908 100%);
  border: 1px solid rgba(196, 168, 130, 0.08);
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(196, 168, 130, 0.04),
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 -6px 16px rgba(0, 0, 0, 0.7),
    0 16px 32px rgba(0, 0, 0, 0.6);
}

/* Micro-texture béton (sans image) */
.bunker-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 1px,
      rgba(0, 0, 0, 0.03) 1px,
      rgba(0, 0, 0, 0.03) 2px
    ),
    repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent 1px,
      rgba(0, 0, 0, 0.02) 1px,
      rgba(0, 0, 0, 0.02) 2px
    );
  opacity: 0.6;
  pointer-events: none;
}

/* GRAIN */
.bunker-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('/textures/noise.png'); /* à ajouter */
  opacity: 0.05;
  pointer-events: none;
}

/* LIGNES TECH */
.tech-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(to right, transparent 98%, rgba(255,255,255,0.05)),
    linear-gradient(to bottom, transparent 98%, rgba(255,255,255,0.05));
  background-size: 40px 40px;
  opacity: 0.15;
}
</style>
