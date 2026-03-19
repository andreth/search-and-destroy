<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import PlanesTable from '@/components/shadcn-tables/PlanesTable.vue'

const page = ref({ title: 'Unités avion' })
const breadcrumbs = ref([
  { text: 'Administration', href: '#' },
  { text: 'Unités avion', disabled: true, href: '#' },
])
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <PlanesTable />
</template>
