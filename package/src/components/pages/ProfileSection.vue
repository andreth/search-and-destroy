<template>
  <section class="space-y-6">
    <div class="mb-4">
      <p class="text-xs uppercase tracking-widest text-gray-500">Paramètres</p>
      <h2 class="text-lg tracking-widest text-[#C4A882] uppercase">Mon profil</h2>
      <p class="mt-1 text-xs text-gray-400">
        Consultez vos informations et modifiez votre email ou mot de passe.
      </p>
    </div>

    <div v-if="!authStore.user && authStore.loading" class="rounded-xl border border-white/10 bg-black/30 p-6 text-center text-gray-400">
      Chargement...
    </div>
    <div v-else-if="authStore.error" class="rounded-xl border border-red-300/30 bg-red-500/10 p-4 text-sm text-red-300">
      {{ authStore.error }}
    </div>

    <template v-else-if="user">
      <BunkerPanel paddingClass="p-6">
        <h3 class="text-sm uppercase tracking-widest text-[#C4A882] mb-4">Informations</h3>
        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt class="text-xs uppercase tracking-widest text-gray-500">Pseudo</dt>
            <dd class="mt-1 font-semibold text-gray-200">{{ user.username }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-widest text-gray-500">Inscrit le</dt>
            <dd class="mt-1 font-semibold text-gray-200">{{ formatDate(user.createdAt) }}</dd>
          </div>
        </dl>

        <div class="profile-sep" />

        <h3 class="text-sm uppercase tracking-widest text-[#C4A882] mb-4">Progression</h3>
        <div class="xp-detail">
          <div class="xp-detail__levels">
            <div class="xp-detail__current">
              <img
                v-if="levelImageUrl"
                :src="levelImageUrl"
                :alt="xpProgress.currentLevelName"
                class="xp-detail__badge"
              />
              <div v-else class="xp-detail__badge xp-detail__badge--placeholder">{{ xpProgress.currentLevel }}</div>
              <div>
                <span class="xp-detail__rank-label">Rang actuel</span>
                <span class="xp-detail__rank-name">{{ xpProgress.currentLevelName }}</span>
              </div>
            </div>
            <div class="xp-detail__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M0 6h20m-4-4l4 4-4 4"/></svg>
            </div>
            <div class="xp-detail__next">
              <img
                v-if="nextLevelImageUrl"
                :src="nextLevelImageUrl"
                :alt="xpProgress.nextLevelName"
                class="xp-detail__badge xp-detail__badge--next-img"
              />
              <div v-else class="xp-detail__badge xp-detail__badge--next">{{ xpProgress.currentLevel + 1 }}</div>
              <div>
                <span class="xp-detail__rank-label">Prochain rang</span>
                <span class="xp-detail__rank-name xp-detail__rank-name--next">{{ xpProgress.nextLevelName }}</span>
              </div>
            </div>
          </div>
          <XpBar
            :current-xp="xpProgress.currentXp"
            :next-level-xp="xpProgress.nextLevelXp"
            :progress="xpProgress.progress"
            :current-level-name="xpProgress.currentLevelName"
            :next-level-name="xpProgress.nextLevelName"
            :show-labels="true"
            :show-percent="true"
            size="lg"
          />
          <p class="xp-detail__remaining">
            Encore <strong>{{ xpProgress.nextLevelXp - xpProgress.currentXp }}</strong> XP avant le prochain rang
          </p>
        </div>
      </BunkerPanel>

      <div class="grid gap-6 lg:grid-cols-2">
        <BunkerPanel paddingClass="p-6">
          <h3 class="text-sm uppercase tracking-widest text-[#C4A882] mb-3">Email</h3>
          <form @submit.prevent="submitEmail" class="space-y-4">
            <div>
              <label for="profile-email" class="mb-1 block text-xs uppercase tracking-widest text-gray-500">Nouvelle adresse email</label>
              <MilitaryInput id="profile-email" v-model="emailForm.email" type="email" placeholder="vous@exemple.com" />
            </div>
            <p v-if="emailError" class="text-xs text-red-300">{{ emailError }}</p>
            <p v-if="emailSuccess" class="text-xs text-[#D4A955]">Email mis à jour.</p>
            <MilitaryButton type="submit" :disabled="emailLoading">
              {{ emailLoading ? 'Enregistrement...' : "Enregistrer l'email" }}
            </MilitaryButton>
          </form>
        </BunkerPanel>

        <BunkerPanel paddingClass="p-6">
          <h3 class="text-sm uppercase tracking-widest text-[#C4A882] mb-3">Mot de passe</h3>
          <form @submit.prevent="submitPassword" class="space-y-4">
            <div>
              <label for="current-password" class="mb-1 block text-xs uppercase tracking-widest text-gray-500">Mot de passe actuel</label>
              <MilitaryInput
                id="current-password"
                v-model="passwordForm.currentPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label for="new-password" class="mb-1 block text-xs uppercase tracking-widest text-gray-500">Nouveau mot de passe</label>
              <MilitaryInput
                id="new-password"
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label for="confirm-password" class="mb-1 block text-xs uppercase tracking-widest text-gray-500">Confirmer</label>
              <MilitaryInput
                id="confirm-password"
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <p v-if="passwordError" class="text-xs text-red-300">{{ passwordError }}</p>
            <p v-if="passwordSuccess" class="text-xs text-[#D4A955]">Mot de passe modifié.</p>
            <MilitaryButton type="submit" :disabled="passwordLoading">
              {{ passwordLoading ? 'Enregistrement...' : 'Changer le mot de passe' }}
            </MilitaryButton>
          </form>
        </BunkerPanel>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import BunkerPanel from '@/components/ui/BunkerPanel.vue'
import MilitaryInput from '@/components/ui/MilitaryInput.vue'
import MilitaryButton from '@/components/ui/MilitaryButton.vue'
import XpBar from '@/components/ui/XpBar.vue'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const xpProgress = computed(() => authStore.xpProgress)
const levelImageUrl = computed(() => {
  const img = xpProgress.value?.currentLevelImage
  return img ? `${API_URL}/uploads/${img}` : null
})
const nextLevelImageUrl = computed(() => {
  const img = xpProgress.value?.nextLevelImage
  return img ? `${API_URL}/uploads/${img}` : null
})

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

const emailForm = ref({ email: '' })
const emailLoading = ref(false)
const emailError = ref<string | null>(null)
const emailSuccess = ref(false)

const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const passwordLoading = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccess = ref(false)

onMounted(async () => {
  if (!authStore.token) return
  if (!authStore.user) await authStore.fetchMe()
  if (user.value?.email) emailForm.value.email = user.value.email
})

async function submitEmail() {
  emailError.value = null
  emailSuccess.value = false
  if (!authStore.token) return
  emailLoading.value = true
  try {
    const res = await axios.patch(
      `${API_URL}/api/auth/me`,
      { email: emailForm.value.email.trim() },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    authStore.setUser(res.data)
    emailSuccess.value = true
  } catch (err: any) {
    emailError.value = err?.response?.data?.error || 'Erreur lors de la mise à jour'
  } finally {
    emailLoading.value = false
  }
}

async function submitPassword() {
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

<style scoped>
.profile-sep {
  height: 1px;
  margin: 20px 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(196, 168, 130, 0.18) 20%,
    rgba(196, 168, 130, 0.25) 50%,
    rgba(196, 168, 130, 0.18) 80%,
    transparent 100%
  );
}

.xp-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.xp-detail__levels {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.xp-detail__current,
.xp-detail__next {
  display: flex;
  align-items: center;
  gap: 10px;
}

.xp-detail__badge {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: 1px solid rgba(196, 168, 130, 0.25);
  object-fit: contain;
  flex-shrink: 0;
}

.xp-detail__badge--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(196, 168, 130, 0.08);
  color: rgba(196, 168, 130, 0.7);
  font-size: 16px;
  font-weight: 800;
}

.xp-detail__badge--next {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 222, 128, 0.06);
  border-color: rgba(74, 222, 128, 0.2);
  color: rgba(74, 222, 128, 0.6);
  font-size: 16px;
  font-weight: 800;
}

.xp-detail__badge--next-img {
  border-color: rgba(74, 222, 128, 0.25);
  background: rgba(74, 222, 128, 0.06);
}

.xp-detail__rank-label {
  display: block;
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(156, 163, 175, 0.7);
}

.xp-detail__rank-name {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(212, 197, 169, 0.95);
  text-transform: uppercase;
}

.xp-detail__rank-name--next {
  color: rgba(74, 222, 128, 0.7);
}

.xp-detail__arrow {
  color: rgba(196, 168, 130, 0.3);
  flex-shrink: 0;
}
.xp-detail__arrow svg {
  width: 28px;
  height: 14px;
}

.xp-detail__remaining {
  font-size: 11px;
  color: rgba(156, 163, 175, 0.8);
  text-align: center;
  letter-spacing: 0.04em;
}
.xp-detail__remaining strong {
  color: rgba(74, 222, 128, 0.9);
  font-weight: 700;
}
</style>
