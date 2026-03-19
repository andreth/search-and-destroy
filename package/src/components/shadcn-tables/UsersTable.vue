<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table/index'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card/index'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Label from '@/components/ui/label/Label.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import { UserPlus, UserCircle, ImageIcon, UserMinus, UserCheck, Trash2 } from 'lucide-vue-next'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function goToProfile(id: string) {
  router.push(`/admin/users/${id}`)
}

// En dev : même origine → Vite proxy vers le backend. En prod : VITE_API_URL.
const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')

interface User {
  id: string
  username: string
  email: string
  role: string
  isActive: boolean
  levelId?: number | null
  Level?: { id: number; levelNumber: number; name: string; image?: string | null } | null
  createdAt: string
}

interface Level {
  id: number
  levelNumber: number
  name: string
  description: string | null
  image?: string | null
}

const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const roleFilter = ref<string>('')
const isActiveFilter = ref<string>('')

const levels = ref<Level[]>([])
const createDialogOpen = ref(false)
const createEmail = ref('')
const createPassword = ref('')
const createRole = ref<'admin' | 'player'>('player')
const createLevelId = ref<number | null>(null)
const createError = ref<string | null>(null)
const createLoading = ref(false)

const confirmOpen = ref(false)
const confirmAction = ref<'deactivate' | 'reactivate' | 'delete' | null>(null)
const confirmUser = ref<User | null>(null)
const confirmLoading = ref(false)
const confirmError = ref<string | null>(null)

function authHeaders() {
  return authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
}

function authConfig(extra?: Record<string, any>) {
  return { ...(extra || {}), headers: { ...(extra?.headers || {}), ...authHeaders() } }
}

function openConfirmDeactivate(user: User) {
  confirmUser.value = user
  confirmAction.value = 'deactivate'
  confirmError.value = null
  confirmOpen.value = true
}

function openConfirmReactivate(user: User) {
  confirmUser.value = user
  confirmAction.value = 'reactivate'
  confirmError.value = null
  confirmOpen.value = true
}

function openConfirmDelete(user: User) {
  confirmUser.value = user
  confirmAction.value = 'delete'
  confirmError.value = null
  confirmOpen.value = true
}

function closeConfirm() {
  confirmOpen.value = false
  confirmAction.value = null
  confirmUser.value = null
  confirmError.value = null
}

async function submitConfirm() {
  const user = confirmUser.value
  const action = confirmAction.value
  if (!user || !action) return
  confirmError.value = null
  confirmLoading.value = true
  try {
    if (action === 'deactivate') {
      await axios.patch(`${API_URL}/api/users/${user.id}`, { isActive: false }, authConfig())
    } else if (action === 'reactivate') {
      await axios.patch(`${API_URL}/api/users/${user.id}`, { isActive: true }, authConfig())
    } else {
      await axios.delete(`${API_URL}/api/users/${user.id}`, authConfig())
    }
    closeConfirm()
    fetchUsers()
  } catch (err: any) {
    const msg = err?.response?.data?.error
    confirmError.value = typeof msg === 'string' ? msg : 'Erreur lors de l\'opération'
  } finally {
    confirmLoading.value = false
  }
}

function openCreateDialog() {
  createDialogOpen.value = true
  createEmail.value = ''
  createPassword.value = ''
  createRole.value = 'player'
  createLevelId.value = levels.value[0]?.id ?? null
  createError.value = null
}

async function submitCreate(e: Event) {
  e.preventDefault()
  createError.value = null
  createLoading.value = true
  try {
    await axios.post(
      `${API_URL}/api/users`,
      {
        email: createEmail.value,
        password: createPassword.value,
        role: createRole.value,
        levelId: createRole.value === 'player' ? createLevelId.value : undefined
      },
      authConfig()
    )
    createDialogOpen.value = false
    fetchUsers()
  } catch (err: any) {
    const msg = err?.response?.data?.error
    createError.value = typeof msg === 'string' ? msg : 'Erreur lors de la création'
  } finally {
    createLoading.value = false
  }
}

function fetchLevels() {
  axios.get(`${API_URL}/api/levels`, authConfig()).then((res) => {
    levels.value = Array.isArray(res.data) ? res.data : []
  }).catch(() => { levels.value = [] })
}

function levelLabel(user: User): string {
  if (user.role !== 'player') return '–'
  if (user.Level?.name) return user.Level.name
  const id = user.levelId
  if (id == null) return '–'
  const l = levels.value.find((x) => x.id === id)
  return l ? l.name : `Niveau ${id}`
}

function levelImageUrl(user: User): string | null {
  if (user.role !== 'player') return null
  const imagePath = user.Level?.image ?? (user.levelId != null ? levels.value.find((l) => l.id === user.levelId)?.image : null)
  if (!imagePath) return null
  const base = API_URL || ''
  return `${base}/uploads/${imagePath}`
}

function fetchUsers() {
  loading.value = true
  error.value = null
  const params: Record<string, string> = {}
  if (search.value.trim()) params.search = search.value.trim()
  if (roleFilter.value) params.role = roleFilter.value
  if (isActiveFilter.value) params.isActive = isActiveFilter.value

  axios
    .get(`${API_URL}/api/users`, authConfig({ params }))
    .then((res) => { users.value = Array.isArray(res.data) ? res.data : [] })
    .catch((err) => {
      users.value = []
      const msg = err?.response?.data?.error || err?.message || 'Erreur réseau'
      error.value = err?.response?.status === 404
        ? 'Route API introuvable. Vérifiez que le backend tourne et que VITE_API_URL pointe vers le bon port (ex. http://localhost:5000).'
        : `Impossible de charger les utilisateurs : ${msg}`
    })
    .finally(() => { loading.value = false })
}

function formatDate(dateStr: string) {
  if (!dateStr) return '–'
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

watch([search, roleFilter, isActiveFilter], () => fetchUsers())
onMounted(() => {
  fetchLevels()
  fetchUsers()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Bouton création + Filtres -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <Button @click="openCreateDialog" class="gap-2">
        <UserPlus class="h-4 w-4 shrink-0" />
        <span>Créer un utilisateur</span>
      </Button>
    </div>

    <Card class="p-4 border shadow-none">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="text-sm font-medium text-muted-foreground block mb-1">Recherche</label>
          <Input
            v-model="search"
            placeholder="Email, pseudo, nom..."
            class="max-w-xs"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-muted-foreground block mb-1">Rôle</label>
          <select
            v-model="roleFilter"
            class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="">Tous</option>
            <option value="admin">Admin</option>
            <option value="player">Player</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium text-muted-foreground block mb-1">Statut</label>
          <select
            v-model="isActiveFilter"
            class="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="">Tous</option>
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </div>
        <div class="flex items-end">
          <Button variant="outline" size="sm" @click="fetchUsers" :disabled="loading">
            Actualiser
          </Button>
        </div>
      </div>
    </Card>

    <!-- Table -->
    <Card class="border shadow-none p-0">
      <Table>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Utilisateur</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Rôle</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Niveau</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Statut</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Inscrit le</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="error">
            <TableCell colspan="6" class="py-4">
              <p class="text-destructive text-sm">{{ error }}</p>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="loading">
            <TableCell colspan="6" class="text-center py-8 text-muted-foreground">
              Chargement...
            </TableCell>
          </TableRow>
          <TableRow v-else-if="users.length === 0">
            <TableCell colspan="6" class="text-center py-8 text-muted-foreground">
              Aucun utilisateur
            </TableCell>
          </TableRow>
          <TableRow
            v-else
            v-for="u in users"
            :key="u.id"
            class="hover:bg-muted/10"
          >
            <TableCell>
              <div class="flex items-center gap-3">
                <Avatar class="h-10 w-10">
                  <AvatarFallback>{{ (u.username || u.email).charAt(0).toUpperCase() }}</AvatarFallback>
                </Avatar>
                <div>
                  <h5 class="font-semibold text-15">{{ u.username }}</h5>
                  <div class="text-sm text-muted">{{ u.email }}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                :class="u.role === 'admin' ? 'bg-lightprimary text-primary' : 'bg-lightsuccess text-success'"
                class="rounded-md font-semibold text-xs px-2 py-0.5"
              >
                {{ u.role }}
              </Badge>
            </TableCell>
            <TableCell class="text-sm">
              <template v-if="u.role === 'player'">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                    <img
                      v-if="levelImageUrl(u)"
                      :src="levelImageUrl(u)!"
                      :alt="levelLabel(u)"
                      class="h-full w-full object-cover"
                    />
                    <ImageIcon v-else class="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <span>{{ levelLabel(u) }}</span>
                </div>
              </template>
              <span v-else>–</span>
            </TableCell>
            <TableCell>
              <Badge
                :class="u.isActive ? 'bg-lightsuccess text-success' : 'bg-lighterror text-error'"
                class="rounded-md font-semibold text-xs px-2 py-0.5"
              >
                {{ u.isActive ? 'Actif' : 'Inactif' }}
              </Badge>
            </TableCell>
            <TableCell class="text-muted-foreground text-sm">
              {{ formatDate(u.createdAt) }}
            </TableCell>
            <TableCell class="text-end">
              <div class="flex items-center justify-end gap-1">
                <Button variant="outline" size="sm" @click="goToProfile(u.id)" title="Voir le profil">
                  <UserCircle class="h-4 w-4" />
                </Button>
                <Button
                  v-if="u.isActive"
                  variant="outline"
                  size="sm"
                  @click="openConfirmDeactivate(u)"
                  title="Désactiver le compte"
                  class="text-warning"
                >
                  <UserMinus class="h-4 w-4" />
                </Button>
                <Button
                  v-else
                  variant="outline"
                  size="sm"
                  @click="openConfirmReactivate(u)"
                  title="Réactiver le compte"
                  class="text-success"
                >
                  <UserCheck class="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  @click="openConfirmDelete(u)"
                  title="Supprimer"
                  class="text-destructive"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <!-- Modal création utilisateur -->
    <Dialog v-model:open="createDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un utilisateur</DialogTitle>
        </DialogHeader>
        <form @submit="submitCreate" class="space-y-4">
          <div class="space-y-2">
            <Label for="create-email">Email</Label>
            <Input id="create-email" v-model="createEmail" type="email" placeholder="email@exemple.com" required />
          </div>
          <div class="space-y-2">
            <Label for="create-password">Mot de passe</Label>
            <Input id="create-password" v-model="createPassword" type="password" placeholder="••••••••" required />
          </div>
          <div class="space-y-2">
            <Label for="create-role">Type</Label>
            <select
              id="create-role"
              v-model="createRole"
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="player">Player</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div v-if="createRole === 'player'" class="space-y-2">
            <Label for="create-level">Niveau</Label>
            <select
              id="create-level"
              v-model.number="createLevelId"
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option v-for="l in levels" :key="l.id" :value="l.id">
                {{ l.levelNumber }} – {{ l.name }}
              </option>
            </select>
          </div>
          <p v-if="createError" class="text-sm text-destructive">{{ createError }}</p>
          <DialogFooter>
            <Button type="button" variant="outline" @click="createDialogOpen = false">
              Annuler
            </Button>
            <Button type="submit" :disabled="createLoading">
              {{ createLoading ? 'Création...' : 'Créer' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Confirmation désactivation / suppression -->
    <Dialog v-model:open="confirmOpen" @update:open="(v: boolean) => !v && closeConfirm()">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {{ confirmAction === 'deactivate' ? 'Désactiver le compte' : confirmAction === 'reactivate' ? 'Réactiver le compte' : 'Supprimer l\'utilisateur' }}
          </DialogTitle>
        </DialogHeader>
        <p v-if="confirmUser" class="text-sm text-muted-foreground">
          {{ confirmAction === 'deactivate'
            ? `Désactiver le compte de ${confirmUser.username} (${confirmUser.email}) ? L'utilisateur ne pourra plus se connecter.`
            : confirmAction === 'reactivate'
              ? `Réactiver le compte de ${confirmUser.username} (${confirmUser.email}) ? L'utilisateur pourra à nouveau se connecter.`
              : `Supprimer définitivement ${confirmUser.username} (${confirmUser.email}) ? Cette action est irréversible.`
          }}
        </p>
        <p v-if="confirmError" class="text-sm text-destructive">{{ confirmError }}</p>
        <DialogFooter>
          <Button type="button" variant="outline" @click="closeConfirm" :disabled="confirmLoading">
            Annuler
          </Button>
          <Button
            type="button"
            :variant="confirmAction === 'delete' ? 'destructive' : 'default'"
            @click="submitConfirm"
            :disabled="confirmLoading"
          >
            {{ confirmLoading ? 'En cours...' : (confirmAction === 'deactivate' ? 'Désactiver' : confirmAction === 'reactivate' ? 'Réactiver' : 'Supprimer') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
