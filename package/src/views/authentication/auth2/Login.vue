<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import FullLogo from '@/layouts/full/logo/Logo.vue'
import AuthLogin from '@/views/authentication/authforms/AuthLogin.vue'
import SocialButtons from '@/views/authentication/authforms/SocialButtons.vue'
import Card from '@/components/ui/card/Card.vue'

const route = useRoute()
const router = useRouter()
const errorFromQuery = ref<string | null>(null)

onMounted(() => {
  const e = route.query.error
  if (typeof e === 'string') {
    errorFromQuery.value = e
    router.replace({ path: '/auth/login2' })
  }
})
</script>

<template>
  <div class="relative overflow-hidden h-screen bg-lightprimary dark:bg-darkprimary">
    <div class="flex h-full justify-center items-center px-4">
      <Card class="md:w-[450px] w-full border-none gap-0">
        <div class=" flex items-center justify-center">
          <FullLogo />
        </div>
        <p v-if="errorFromQuery" class="text-sm text-destructive text-center mx-4 mb-2">
          {{ errorFromQuery }}
        </p>
        <SocialButtons title="or sign in with" />
        <AuthLogin />
        <div class="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-center">
          <p>New to Search & Destroy?</p>
          <RouterLink to="/auth/register2" class="text-primary text-sm font-medium">
            Create an account
          </RouterLink>
        </div>
      </Card>
    </div>
  </div>

</template>