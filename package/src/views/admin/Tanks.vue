<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import TanksTable from '@/components/shadcn-tables/TanksTable.vue'

const page = ref({ title: 'Unités tank' })
const breadcrumbs = ref([
  { text: 'Administration', href: '#' },
  { text: 'Unités tank', disabled: true, href: '#' },
])
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <TanksTable />
</template>
