<template>
  <BunkerPanel paddingClass="p-4">
    <h3 class="text-sm uppercase text-gray-400 mb-3">Technologie</h3>
    <UnitGrid :items="tech" columns="3" />
  </BunkerPanel>
</template>

<script setup lang="ts">
import BunkerPanel from '../ui/BunkerPanel.vue'
import UnitGrid from '../ui/UnitGrid.vue'

defineProps<{
  tech?: Array<string>
}>()
</script>
