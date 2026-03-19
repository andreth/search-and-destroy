<template>
  <input v-model="model" :type="type" :placeholder="placeholder" class="military-input" />
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })

defineProps<{
  type?: string
  placeholder?: string
}>()
</script>

<style scoped>
.military-input {
  background: #0a0908;
  border: 1px solid rgba(196, 168, 130, 0.1);

  box-shadow:
    inset 0 2px 4px rgba(0,0,0,0.8);

  font-family: 'Roboto Mono', monospace;
  letter-spacing: 0.08em;

  display: block;
  width: 100%;
  padding: 16px 18px;
  min-height: 58px;
  border-radius: 14px;
  font-size: 15px;
  line-height: 1.2;
  color: rgba(212, 197, 169, 0.95);
}

.military-input::placeholder {
  color: rgba(196, 168, 130, 0.35);
}

.military-input:focus {
  border-color: rgba(196, 168, 130, 0.45);
  box-shadow:
    0 0 8px rgba(196, 168, 130, 0.15);
  outline: none;
}
</style>
