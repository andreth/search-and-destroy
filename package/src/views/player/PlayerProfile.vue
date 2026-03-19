<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label/Label.vue'
import axios from 'axios'
import { router } from '@/router'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')
const authStore = useAuthStore()

const user = computed(() => authStore.user)

function levelImageUrl(): string | null {
  if (!user.value?.Level?.image) return null
  return `${API_URL}/uploads/${user.value.Level.image}`
}
const levelName = computed(() => user.value?.Level?.name || 'Niveau 1')

function formatDate(dateStr?: string) {
  if (!dateStr) return '–'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Édition email
const emailForm = ref({ email: '' })
const emailLoading = ref(false)
const emailError = ref<string | null>(null)
const emailSuccess = ref(false)

// Édition mot de passe
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const passwordLoading = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccess = ref(false)

onMounted(async () => {
  if (!authStore.token) return
  if (!authStore.user) await authStore.fetchMe()
  if (user.value?.email) emailForm.value.email = user.value.email
})

async function submitEmail(e: Event) {
  e.preventDefault()
  emailError.value = null
  emailSuccess.value = false
  if (!authStore.token) return
  emailLoading.value = true
  try {
    const res = await axios.patch(`${API_URL}/api/auth/me`, { email: emailForm.value.email.trim() }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    authStore.setUser(res.data)
    emailSuccess.value = true
  } catch (err: any) {
    emailError.value = err?.response?.data?.error || 'Erreur lors de la mise à jour'
  } finally {
    emailLoading.value = false
  }
}

async function submitPassword(e: Event) {
  e.preventDefault()
  passwordError.value = null
  passwordSuccess.value = false
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Les deux mots de passe ne correspondent pas'
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Le mot de passe doit faire au moins 6 caractères'
    return
  }
  if (!authStore.token) return
  passwordLoading.value = true
  try {
    await axios.patch(
      `${API_URL}/api/auth/me`,
      {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    passwordSuccess.value = true
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err: any) {
    passwordError.value = err?.response?.data?.error || 'Erreur lors du changement de mot de passe'
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <div class="h-svh w-full overflow-hidden bg-slate-950 text-slate-100">
    <div class="relative h-svh w-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)]">
      <div class="pointer-events-none absolute inset-0 opacity-30">
        <div class="absolute left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
        <div class="absolute bottom-20 right-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main class="relative z-10 h-svh overflow-auto px-4 py-6 md:px-8">
        <div class="mx-auto w-full max-w-5xl space-y-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Paramètres</p>
              <h1 class="mt-2 text-2xl font-bold tracking-wide text-white">Mon profil</h1>
              <p class="mt-2 text-sm text-slate-300/80">
                Consultez vos informations et modifiez votre email ou mot de passe.
              </p>
            </div>
            <Button
              type="button"
              class="bg-slate-900/70 text-slate-100 border border-white/10 hover:border-cyan-300/40 hover:bg-slate-900/80"
              @click="router.push('/player').catch(() => {})"
            >
              ← Retour au HUD
            </Button>
          </div>

          <div v-if="!authStore.user && authStore.loading" class="rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-center text-slate-300">
            Chargement...
          </div>
          <div v-else-if="authStore.error" class="rounded-3xl border border-red-300/20 bg-red-500/10 p-5 text-red-200">
            {{ authStore.error }}
          </div>

          <template v-else-if="user">
            <!-- Infos en lecture seule -->
            <Card class="border-white/10 bg-slate-900/60 text-slate-100 shadow-2xl shadow-black/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle class="text-white">Informations</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt class="text-xs uppercase tracking-[0.2em] text-slate-400">Pseudo</dt>
                    <dd class="mt-1 font-semibold">{{ user.username }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs uppercase tracking-[0.2em] text-slate-400">Niveau</dt>
                    <dd class="mt-1 flex items-center gap-2 font-semibold">
                      <span v-if="levelImageUrl()" class="inline-flex h-6 w-6 overflow-hidden rounded">
                        <img :src="levelImageUrl()!" :alt="levelName" class="h-full w-full object-cover" />
                      </span>
                      {{ levelName }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-xs uppercase tracking-[0.2em] text-slate-400">Inscrit le</dt>
                    <dd class="mt-1 font-semibold">{{ formatDate(user.createdAt) }}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <!-- Compte / sécurité -->
            <Card class="border-white/10 bg-slate-900/60 text-slate-100 shadow-2xl shadow-black/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle class="text-white">Compte &amp; sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid gap-6 lg:grid-cols-2">
                  <div class="space-y-3">
                    <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Email</p>
                    <form @submit="submitEmail" class="space-y-4">
                      <div class="space-y-2">
                        <Label for="profile-email" class="text-slate-200">Nouvelle adresse email</Label>
                        <Input
                          id="profile-email"
                          v-model="emailForm.email"
                          type="email"
                          required
                          placeholder="vous@exemple.com"
                          class="w-full border-white/10 bg-slate-950/60 text-slate-100"
                        />
                      </div>
                      <p v-if="emailError" class="text-sm text-red-200">{{ emailError }}</p>
                      <p v-if="emailSuccess" class="text-sm text-emerald-300">Email mis à jour.</p>
                      <Button type="submit" :disabled="emailLoading" class="bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/20">
                        {{ emailLoading ? 'Enregistrement...' : 'Enregistrer l\'email' }}
                      </Button>
                    </form>
                  </div>

                  <div class="space-y-3">
                    <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Mot de passe</p>
                    <form @submit="submitPassword" class="space-y-4">
                      <div class="space-y-2">
                        <Label for="current-password" class="text-slate-200">Mot de passe actuel</Label>
                        <Input
                          id="current-password"
                          v-model="passwordForm.currentPassword"
                          type="password"
                          required
                          autocomplete="current-password"
                          class="w-full border-white/10 bg-slate-950/60 text-slate-100"
                        />
                      </div>
                      <div class="space-y-2">
                        <Label for="new-password" class="text-slate-200">Nouveau mot de passe</Label>
                        <Input
                          id="new-password"
                          v-model="passwordForm.newPassword"
                          type="password"
                          required
                          minlength="6"
                          autocomplete="new-password"
                          class="w-full border-white/10 bg-slate-950/60 text-slate-100"
                        />
                      </div>
                      <div class="space-y-2">
                        <Label for="confirm-password" class="text-slate-200">Confirmer le nouveau mot de passe</Label>
                        <Input
                          id="confirm-password"
                          v-model="passwordForm.confirmPassword"
                          type="password"
                          required
                          minlength="6"
                          autocomplete="new-password"
                          class="w-full border-white/10 bg-slate-950/60 text-slate-100"
                        />
                      </div>
                      <p v-if="passwordError" class="text-sm text-red-200">{{ passwordError }}</p>
                      <p v-if="passwordSuccess" class="text-sm text-emerald-300">Mot de passe modifié.</p>
                      <Button type="submit" :disabled="passwordLoading" class="bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/20">
                        {{ passwordLoading ? 'Enregistrement...' : 'Changer le mot de passe' }}
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>
