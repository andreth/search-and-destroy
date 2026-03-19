<template>
  <footer class="footer">
    <button v-for="action in actions" :key="String(action)" class="footer-btn" type="button">
      {{ action }}
    </button>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  actions?: Array<string>
}>()
</script>

<style scoped>
.footer {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}
.footer-btn {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 14px;
  color: #d1d5db;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.footer-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(74, 222, 128, 0.22);
}
</style>
