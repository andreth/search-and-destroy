<template>
  <div class="grid gap-4" :class="columnsClass">
    <div v-for="item in items" :key="String(item)" class="unit-card">
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items?: Array<string>
    columns?: '3' | '4'
  }>(),
  { items: () => [], columns: '4' }
)

const columnsClass = props.columns === '3' ? 'grid-cols-3' : 'grid-cols-4'
</script>

<style scoped>
.unit-card {
  background: linear-gradient(180deg, #141917, #0a0d0c);
  border: 1px solid rgba(255,255,255,0.05);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.05),
    0 10px 20px rgba(0,0,0,0.6);

  transition: all 0.2s ease;
}

.unit-card:hover {
  transform: translateY(-2px);
  border-color: rgba(74,222,128,0.3);
}
</style>
