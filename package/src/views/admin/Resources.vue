<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import ResourcesTable from '@/components/shadcn-tables/ResourcesTable.vue'

const page = ref({ title: 'Ressources de base' })
const breadcrumbs = ref([
  { text: 'Administration', href: '#' },
  { text: 'Ressources de base', disabled: true, href: '#' },
])
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <ResourcesTable />
</template>
