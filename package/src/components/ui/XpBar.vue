<template>
  <div class="xp-bar" :class="[`xp-bar--${size}`]">
    <div v-if="showLabels" class="xp-bar__header">
      <span class="xp-bar__level">{{ currentLevelName }}</span>
      <span class="xp-bar__xp">{{ currentXp }} / {{ nextLevelXp }} XP</span>
      <span class="xp-bar__next">{{ nextLevelName }}</span>
    </div>
    <div class="xp-bar__track">
      <div class="xp-bar__fill" :style="{ width: (progress * 100) + '%' }">
        <div class="xp-bar__glow" />
      </div>
      <div class="xp-bar__ticks">
        <span v-for="i in 4" :key="i" class="xp-bar__tick" :style="{ left: (i * 20) + '%' }" />
      </div>
    </div>
    <div v-if="showPercent" class="xp-bar__footer">
      <span class="xp-bar__percent">{{ Math.round(progress * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    currentXp: number
    nextLevelXp: number
    progress: number
    currentLevelName?: string
    nextLevelName?: string
    showLabels?: boolean
    showPercent?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    currentLevelName: '',
    nextLevelName: '',
    showLabels: true,
    showPercent: false,
    size: 'md'
  }
)
</script>

<style scoped>
.xp-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

/* Header: level labels + xp count */
.xp-bar__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}
.xp-bar__level {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(196, 168, 130, 0.8);
}
.xp-bar__xp {
  font-size: 9px;
  letter-spacing: 0.08em;
  color: rgba(212, 197, 169, 0.7);
  font-variant-numeric: tabular-nums;
}
.xp-bar__next {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(74, 222, 128, 0.5);
}

/* Track */
.xp-bar__track {
  position: relative;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(196, 168, 130, 0.12);
  overflow: hidden;
}

.xp-bar--sm .xp-bar__track { height: 6px; }
.xp-bar--md .xp-bar__track { height: 10px; }
.xp-bar--lg .xp-bar__track { height: 16px; }

/* Fill */
.xp-bar__fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg,
    rgba(74, 222, 128, 0.6) 0%,
    rgba(74, 222, 128, 0.8) 60%,
    rgba(74, 222, 128, 0.95) 100%
  );
  transition: width 0.6s ease;
}

.xp-bar__glow {
  position: absolute;
  top: 0;
  right: -2px;
  bottom: 0;
  width: 8px;
  background: linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.6));
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
  animation: xp-glow-pulse 2s ease-in-out infinite;
}

@keyframes xp-glow-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Tick marks */
.xp-bar__ticks {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.xp-bar__tick {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(196, 168, 130, 0.1);
}

/* Footer */
.xp-bar__footer {
  display: flex;
  justify-content: flex-end;
}
.xp-bar__percent {
  font-size: 9px;
  letter-spacing: 0.1em;
  color: rgba(74, 222, 128, 0.6);
  font-variant-numeric: tabular-nums;
}
</style>
