<script setup lang="ts">
import { ref } from 'vue'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import UsersTable from '@/components/shadcn-tables/UsersTable.vue'

const page = ref({ title: 'Utilisateurs' })
const breadcrumbs = ref([
  { text: 'Administration', disabled: false, href: '#' },
  { text: 'Utilisateurs', disabled: true, href: '#' },
])
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <UsersTable />
</template>
