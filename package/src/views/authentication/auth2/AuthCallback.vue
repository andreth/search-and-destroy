<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const errorMessages: Record<string, string> = {
  missing_code: 'Connexion annulée ou code manquant.',
  token_exchange_failed: 'Échec de l\'échange avec Google.',
  no_access_token: 'Google n\'a pas renvoyé de jeton.',
  userinfo_failed: 'Impossible de récupérer vos informations Google.',
  email_not_granted: 'L\'accès à votre adresse email est nécessaire.',
  account_disabled: 'Ce compte a été désactivé. Contactez un administrateur.',
  server_error: 'Erreur serveur. Réessayez plus tard.',
  google_not_configured: 'Connexion Google non configurée sur le serveur.',
}

onMounted(() => {
  const token = typeof route.query.token === 'string' ? route.query.token : null
  const error = typeof route.query.error === 'string' ? route.query.error : null

  if (token) {
    authStore.setToken(token)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(redirect)
    return
  }

  const message = error ? (errorMessages[error] || error) : 'Une erreur est survenue.'
  router.replace({ path: '/auth/login2', query: { error: message } })
})
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-lightprimary dark:bg-darkprimary">
    <p class="text-muted-foreground">Redirection en cours...</p>
  </div>
</template>
