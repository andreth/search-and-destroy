<template>
  <ul class="stat-list">
    <li v-for="(item, i) in items" :key="String(item)" class="stat-list__item">
      <span class="stat-list__index">{{ String(i + 1).padStart(2, '0') }}</span>
      <span class="stat-list__label">{{ item }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  items?: Array<string>
}>()
</script>

<style scoped>
.stat-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.stat-list__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: rgba(209, 213, 219, 0.9);
}
.stat-list__item:last-child {
  border-bottom: none;
}
.stat-list__index {
  font-variant-numeric: tabular-nums;
  color: rgba(74, 222, 128, 0.5);
  min-width: 20px;
}
.stat-list__label {
  flex: 1;
}
</style>
