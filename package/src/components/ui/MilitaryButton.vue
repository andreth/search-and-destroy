<template>
  <button class="military-button" :class="variantClass" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', disabled: false }
)

const variantClass = props.variant === 'secondary' ? 'military-button-secondary' : 'military-button-primary'
</script>

<style scoped>
.military-button {
  width: 100%;
  padding: 14px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  border: 1px solid rgba(196, 168, 130, 0.12);
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.1;
  color: rgba(212, 197, 169, 0.95);
}
.military-button:hover {
  transform: translateY(-1px);
  border-color: rgba(196, 168, 130, 0.25);
}
.military-button:active {
  transform: translateY(1px);
}
.military-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.military-button-primary {
  background: linear-gradient(180deg, #2a2418, #141210);
  border: 1px solid rgba(196, 168, 130, 0.1);
  box-shadow:
    inset 0 1px 0 rgba(196, 168, 130, 0.06),
    inset 0 -2px 6px rgba(0,0,0,0.8);
}

.military-button:hover {
  background: linear-gradient(180deg, #332c1e, #1c1812);
}

.military-button:active {
  transform: translateY(2px);
  box-shadow:
    inset 0 3px 8px rgba(0,0,0,0.9);
}
.military-button-secondary {
  background: #110f0c;
  color: #d4c5a9;
}
</style>
