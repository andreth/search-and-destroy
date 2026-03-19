<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import LevelsTable from '@/components/shadcn-tables/LevelsTable.vue'

const page = ref({ title: 'Niveaux (gamification)' })
const breadcrumbs = ref([
  { text: 'Administration', disabled: false, href: '#' },
  { text: 'Niveaux', disabled: true, href: '#' },
])
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <LevelsTable />
</template>
