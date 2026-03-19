<template>
  <aside class="sidenav">
    <!-- Emblem -->
    <div class="sidenav-emblem" aria-hidden="true">
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1">
        <circle cx="30" cy="30" r="26" stroke-opacity="0.5" />
        <circle cx="30" cy="30" r="18" stroke-opacity="0.35" stroke-dasharray="3 3" />
        <circle cx="30" cy="30" r="10" stroke-opacity="0.25" />
        <line x1="30" y1="2" x2="30" y2="58" stroke-opacity="0.2" />
        <line x1="2" y1="30" x2="58" y2="30" stroke-opacity="0.2" />
        <line x1="9" y1="9" x2="51" y2="51" stroke-opacity="0.08" />
        <line x1="51" y1="9" x2="9" y2="51" stroke-opacity="0.08" />
        <circle cx="30" cy="30" r="3" fill="currentColor" fill-opacity="0.6" stroke="none" />
        <circle cx="30" cy="30" r="5" stroke-opacity="0.5" stroke-width="0.5" />
      </svg>
      <div class="sidenav-emblem-glow" />
    </div>

    <div class="sidenav-sep" />

    <button
      v-for="item in items"
      :key="item.key"
      class="nav-btn"
      :class="item.key === modelValue ? 'nav-btn-active' : ''"
      type="button"
      @click="$emit('update:modelValue', item.key)"
    >
      <span class="nav-btn-indicator" />
      {{ item.label }}
    </button>
  </aside>
</template>

<script setup lang="ts">
export interface SideNavItem {
  key: string
  label: string
}

withDefaults(
  defineProps<{
    modelValue: string
    items?: SideNavItem[]
  }>(),
  { items: () => [] }
)

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.sidenav {
  width: 96px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #0e0d0b, #080706);
  border-right: 1px solid rgba(196, 168, 130, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 12px 8px;
  gap: 8px;
  min-height: 0;
}

/* Emblem — more pronounced */
.sidenav-emblem {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 0 4px;
  color: rgba(74, 222, 128, 0.7);
}
.sidenav-emblem svg {
  width: 50px;
  height: 50px;
  filter: drop-shadow(0 0 6px rgba(74, 222, 128, 0.2));
}
.sidenav-emblem-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.08), transparent 70%);
  pointer-events: none;
}
.sidenav-sep {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.15), transparent);
  margin: 2px 4px 6px;
}

/* Nav buttons */
.nav-btn {
  position: relative;
  width: 100%;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #9ca3af;
  padding: 12px 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  background: rgba(17, 17, 17, 0.6);
  transition: transform 0.15s ease, color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
  overflow: hidden;
}
.nav-btn:hover {
  transform: translateY(-1px);
  color: #C4A882;
  border-color: rgba(196, 168, 130, 0.25);
  background: rgba(196, 168, 130, 0.04);
}

/* Active indicator */
.nav-btn-indicator {
  position: absolute;
  left: 0;
  top: 25%;
  bottom: 25%;
  width: 2px;
  background: transparent;
  border-radius: 0 2px 2px 0;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}
.nav-btn-active .nav-btn-indicator {
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}
.nav-btn-active {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.3);
  background: rgba(74, 222, 128, 0.04);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}
</style>
