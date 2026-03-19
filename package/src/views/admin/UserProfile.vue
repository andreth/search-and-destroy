<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue'
import { Card } from '@/components/ui/card/index'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label/Label.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')
const authStore = useAuthStore()

function authHeaders() {
  const token = authStore.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const route = useRoute()
const router = useRouter()
// Vue Router peut exposer params.id comme string ou tableau selon la config
const userId = computed(() => {
  const p = route.params.id
  return Array.isArray(p) ? p[0] : (p ?? '')
})

const user = ref<{
  id: string
  username: string
  email: string
  role: string
  isActive: boolean
  levelId?: number | null
  Level?: { id: number; levelNumber: number; name: string; image?: string | null } | null
  createdAt: string
  updatedAt: string
} | null>(null)

interface Level {
  id: number
  levelNumber: number
  name: string
  description: string | null
}
const levels = ref<Level[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const editLevelOpen = ref(false)
const editLevelValue = ref<number>(0)
const editLevelLoading = ref(false)
const editLevelError = ref<string | null>(null)

// Formulaire d'édition admin : pseudo, email, statut, mot de passe
const editForm = ref({ username: '', email: '', isActive: true, newPassword: '' })
const editLoading = ref(false)
const editError = ref<string | null>(null)
const editSuccess = ref(false)

watch(user, (u) => {
  if (u) {
    editForm.value.username = u.username ?? ''
    editForm.value.email = u.email ?? ''
    editForm.value.isActive = u.isActive ?? true
    editForm.value.newPassword = ''
  }
}, { immediate: true })

const displayName = computed(() => user.value?.username || user.value?.email || '–')

function formatDate(dateStr: string) {
  if (!dateStr) return '–'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function goBack() {
  router.push('/admin/users')
}

function levelLabel(): string {
  if (!user.value || user.value.role !== 'player') return '–'
  if (user.value.Level?.name) return user.value.Level.name
  const id = user.value.levelId
  if (id == null) return '–'
  const l = levels.value.find((x) => x.id === id)
  return l ? l.name : `Niveau ${id}`
}

function levelImageUrl(): string | null {
  if (!user.value || user.value.role !== 'player' || !user.value.Level?.image) return null
  const base = API_URL || ''
  return `${base}/uploads/${user.value.Level.image}`
}

function openEditLevel() {
  if (!user.value || user.value.role !== 'player') return
  editLevelValue.value = user.value.levelId ?? levels.value[0]?.id ?? 0
  editLevelError.value = null
  editLevelOpen.value = true
}

async function submitEditLevel(e: Event) {
  e.preventDefault()
  const id = userId.value
  if (!id || !user.value) return
  editLevelError.value = null
  editLevelLoading.value = true
  try {
    const res = await axios.patch(
      `${API_URL}/api/users/${encodeURIComponent(id)}`,
      { levelId: editLevelValue.value },
      { headers: authHeaders() }
    )
    user.value = res.data
    editLevelOpen.value = false
  } catch (err: any) {
    editLevelError.value = err?.response?.data?.error || 'Erreur lors de la mise à jour'
  } finally {
    editLevelLoading.value = false
  }
}

async function submitEditUser(e: Event) {
  e.preventDefault()
  const id = userId.value
  if (!id || !user.value) return
  editError.value = null
  editSuccess.value = false
  editLoading.value = true
  try {
    const payload: Record<string, unknown> = {
      username: editForm.value.username.trim(),
      email: editForm.value.email.trim(),
      isActive: editForm.value.isActive
    }
    if (editForm.value.newPassword.trim()) {
      payload.newPassword = editForm.value.newPassword
    }
    const res = await axios.patch(
      `${API_URL}/api/users/${encodeURIComponent(id)}`,
      payload,
      { headers: authHeaders() }
    )
    user.value = res.data
    editForm.value.newPassword = ''
    editSuccess.value = true
  } catch (err: any) {
    editError.value = err?.response?.data?.error || 'Erreur lors de la mise à jour'
  } finally {
    editLoading.value = false
  }
}

onMounted(() => {
  axios.get(`${API_URL}/api/levels`).then((res) => {
    levels.value = Array.isArray(res.data) ? res.data : []
  }).catch(() => { levels.value = [] })

  const id = userId.value
  if (!id || typeof id !== 'string') {
    error.value = 'ID utilisateur manquant'
    loading.value = false
    return
  }
  const url = `${API_URL}/api/users/${encodeURIComponent(id)}`
  axios
    .get(url)
    .then((res) => { user.value = res.data; error.value = null })
    .catch((err) => {
      error.value = err?.response?.status === 404
        ? 'Utilisateur non trouvé'
        : (err?.response?.data?.error || 'Erreur lors du chargement')
    })
    .finally(() => { loading.value = false })
})
</script>

<template>
  <div class="space-y-6">
    <BaseBreadcrumb
      title="Profil utilisateur"
      :breadcrumbs="[
        { text: 'Administration', disabled: false, href: '/admin/users' },
        { text: 'Utilisateurs', disabled: false, href: '/admin/users' },
        { text: displayName, disabled: true, href: '#' }
      ]"
    />

    <Button variant="outline" size="sm" @click="goBack" class="mb-2">
      ← Retour à la liste
    </Button>

    <div v-if="loading" class="text-muted-foreground py-8 text-center">
      Chargement du profil...
    </div>
    <p v-else-if="error" class="text-destructive">{{ error }}</p>

    <template v-else-if="user">
      <Card class="p-6 overflow-hidden">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <Avatar class="h-20 w-20">
            <AvatarFallback class="text-xl">
              {{ (user.username || user.email).charAt(0).toUpperCase() }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl font-semibold">{{ displayName }}</h1>
            <p class="text-muted-foreground">{{ user.email }}</p>
            <div class="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <Badge :class="user.role === 'admin' ? 'bg-lightprimary text-primary' : 'bg-lightsuccess text-success'">
                {{ user.role }}
              </Badge>
              <Badge v-if="user.role === 'player'" class="bg-lightsecondary text-secondary flex items-center gap-1.5 w-fit">
                <span v-if="levelImageUrl()" class="inline-flex shrink-0">
                  <img :src="levelImageUrl()!" :alt="levelLabel()" class="h-4 w-4 rounded object-cover" />
                </span>
                {{ levelLabel() }}
              </Badge>
              <Badge :class="user.isActive ? 'bg-lightsuccess text-success' : 'bg-lighterror text-error'">
                {{ user.isActive ? 'Actif' : 'Inactif' }}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <h2 class="text-lg font-semibold mb-4">Informations</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt class="text-xs text-muted-foreground">Pseudo</dt>
            <dd class="font-medium">{{ user.username }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted-foreground">Email</dt>
            <dd class="font-medium">{{ user.email }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted-foreground">Rôle</dt>
            <dd class="font-medium">{{ user.role }}</dd>
          </div>
          <div v-if="user.role === 'player'">
            <dt class="text-xs text-muted-foreground">Niveau</dt>
            <dd class="font-medium flex items-center gap-2 flex-wrap">
              <div class="flex items-center gap-2">
                <div v-if="levelImageUrl()" class="h-10 w-10 rounded overflow-hidden bg-muted shrink-0">
                  <img :src="levelImageUrl()!" :alt="levelLabel()" class="h-full w-full object-cover" />
                </div>
                <span>{{ levelLabel() }}</span>
              </div>
              <Button variant="outline" size="sm" class="h-7 text-xs" @click="openEditLevel">
                Modifier
              </Button>
            </dd>
          </div>
          <div>
            <dt class="text-xs text-muted-foreground">Statut</dt>
            <dd class="font-medium">{{ user.isActive ? 'Actif' : 'Inactif' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted-foreground">Inscrit le</dt>
            <dd class="font-medium">{{ formatDate(user.createdAt) }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted-foreground">Dernière mise à jour</dt>
            <dd class="font-medium">{{ formatDate(user.updatedAt) }}</dd>
          </div>
        </dl>
      </Card>

      <!-- Formulaire d'édition admin : pseudo, email, statut, mot de passe -->
      <Card class="p-6">
        <h2 class="text-lg font-semibold mb-4">Modifier l'utilisateur</h2>
        <form @submit="submitEditUser" class="space-y-4 max-w-md">
          <div class="space-y-2">
            <Label for="edit-username">Pseudo</Label>
            <Input
              id="edit-username"
              v-model="editForm.username"
              type="text"
              required
              minlength="2"
              placeholder="Pseudo"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <Label for="edit-email">Email</Label>
            <Input
              id="edit-email"
              v-model="editForm.email"
              type="email"
              required
              placeholder="email@exemple.com"
              class="w-full"
            />
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="edit-isActive" v-model:checked="editForm.isActive" />
            <Label for="edit-isActive" class="font-normal cursor-pointer">Compte actif</Label>
          </div>
          <div class="space-y-2">
            <Label for="edit-newPassword">Nouveau mot de passe (laisser vide pour ne pas modifier)</Label>
            <Input
              id="edit-newPassword"
              v-model="editForm.newPassword"
              type="password"
              minlength="6"
              autocomplete="new-password"
              placeholder="••••••••"
              class="w-full"
            />
          </div>
          <p v-if="editError" class="text-sm text-destructive">{{ editError }}</p>
          <p v-if="editSuccess" class="text-sm text-green-600 dark:text-green-400">Modifications enregistrées.</p>
          <Button type="submit" :disabled="editLoading">
            {{ editLoading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </Button>
        </form>
      </Card>

      <!-- Modal modification niveau (player) -->
      <Dialog v-model:open="editLevelOpen">
        <DialogContent class="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Modifier le niveau</DialogTitle>
          </DialogHeader>
          <form @submit="submitEditLevel" class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Niveau</label>
              <select
                v-model.number="editLevelValue"
                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option v-for="l in levels" :key="l.id" :value="l.id">
                  {{ l.levelNumber }} – {{ l.name }}
                </option>
              </select>
            </div>
            <p v-if="editLevelError" class="text-sm text-destructive">{{ editLevelError }}</p>
            <DialogFooter>
              <Button type="button" variant="outline" @click="editLevelOpen = false">Annuler</Button>
              <Button type="submit" :disabled="editLevelLoading">
                {{ editLevelLoading ? 'Enregistrement...' : 'Enregistrer' }}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </template>
  </div>
</template>
