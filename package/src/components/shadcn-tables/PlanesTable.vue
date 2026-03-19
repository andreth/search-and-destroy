<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table/index'
import { Card } from '@/components/ui/card/index'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Label from '@/components/ui/label/Label.vue'
import { Input } from '@/components/ui/input'
import { Pencil, ImageIcon, Plus, Trash2 } from 'lucide-vue-next'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')
const authStore = useAuthStore()

function authHeaders() {
  const token = authStore.token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

interface Plane {
  id: number
  name: string
  description: string | null
  image: string | null
  createdAt: string
  updatedAt: string
}

const planes = ref<Plane[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const createOpen = ref(false)
const createName = ref('')
const createDescription = ref('')
const createImageFile = ref<File | null>(null)
const createImagePreview = ref<string | null>(null)
const createImageInputRef = ref<HTMLInputElement | null>(null)
const createLoading = ref(false)
const createError = ref<string | null>(null)

const editOpen = ref(false)
const editingPlane = ref<Plane | null>(null)
const editName = ref('')
const editDescription = ref('')
const editLoading = ref(false)
const editError = ref<string | null>(null)
const imageUploadRef = ref<HTMLInputElement | null>(null)
const imageUploading = ref(false)
const imageUploadError = ref<string | null>(null)

const deleteTarget = ref<Plane | null>(null)
const deleteDialogOpen = ref(false)
const deleteLoading = ref(false)
const deleteError = ref<string | null>(null)

function planeImageUrl(plane: Plane): string | null {
  if (!plane?.image) return null
  return `${API_URL}/uploads/${plane.image}`
}

function fetchPlanes() {
  loading.value = true
  error.value = null
  axios
    .get(`${API_URL}/api/planes`, { headers: authHeaders() })
    .then((res) => { planes.value = Array.isArray(res.data) ? res.data : [] })
    .catch((err) => {
      planes.value = []
      error.value = err?.response?.data?.error || err?.message || 'Erreur réseau'
    })
    .finally(() => { loading.value = false })
}

function openCreate() {
  createName.value = ''
  createDescription.value = ''
  createImageFile.value = null
  createImagePreview.value = null
  createError.value = null
  createOpen.value = true
}

function triggerCreateImageInput() {
  createImageInputRef.value?.click()
}

function onCreateImageChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  createImageFile.value = file
  createImagePreview.value = URL.createObjectURL(file)
}

async function submitCreate(e: Event) {
  e.preventDefault()
  if (!createName.value.trim()) return
  createError.value = null
  createLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', createName.value.trim())
    formData.append('description', createDescription.value.trim())
    if (createImageFile.value) {
      formData.append('image', createImageFile.value)
    }
    await axios.post(`${API_URL}/api/planes`, formData, {
      headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
    })
    createOpen.value = false
    fetchPlanes()
  } catch (err: any) {
    createError.value = err?.response?.data?.error || 'Erreur lors de la création'
  } finally {
    createLoading.value = false
  }
}

function openEdit(plane: Plane) {
  editingPlane.value = plane
  editName.value = plane.name
  editDescription.value = plane.description ?? ''
  editError.value = null
  imageUploadError.value = null
  editOpen.value = true
}

function closeEdit() {
  editOpen.value = false
  editingPlane.value = null
}

async function submitEdit(e: Event) {
  e.preventDefault()
  const plane = editingPlane.value
  if (!plane) return
  editError.value = null
  editLoading.value = true
  try {
    const res = await axios.patch(
      `${API_URL}/api/planes/${plane.id}`,
      { name: editName.value.trim(), description: editDescription.value.trim() || null },
      { headers: authHeaders() }
    )
    const idx = planes.value.findIndex((p) => p.id === plane.id)
    if (idx !== -1) planes.value[idx] = res.data
    closeEdit()
  } catch (err: any) {
    editError.value = err?.response?.data?.error || 'Erreur lors de la mise à jour'
  } finally {
    editLoading.value = false
  }
}

function triggerImageInput() {
  imageUploadError.value = null
  imageUploadRef.value?.click()
}

async function onImageChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !editingPlane.value) return
  imageUploadError.value = null
  imageUploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const res = await axios.post(
      `${API_URL}/api/planes/${editingPlane.value.id}/image`,
      formData,
      { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } }
    )
    if (editingPlane.value) {
      editingPlane.value = { ...editingPlane.value, image: res.data.image }
    }
    const idx = planes.value.findIndex((p) => p.id === editingPlane.value?.id)
    if (idx !== -1) planes.value[idx] = { ...planes.value[idx], image: res.data.image }
  } catch (err: any) {
    imageUploadError.value = err?.response?.data?.error || "Erreur lors de l'upload"
  } finally {
    imageUploading.value = false
    target.value = ''
  }
}

function confirmDelete(plane: Plane) {
  deleteTarget.value = plane
  deleteError.value = null
  deleteDialogOpen.value = true
}

function closeDelete() {
  deleteTarget.value = null
  deleteDialogOpen.value = false
}

async function submitDelete() {
  const plane = deleteTarget.value
  if (!plane) return
  deleteError.value = null
  deleteLoading.value = true
  try {
    await axios.delete(`${API_URL}/api/planes/${plane.id}`, { headers: authHeaders() })
    closeDelete()
    fetchPlanes()
  } catch (err: any) {
    deleteError.value = err?.response?.data?.error || 'Erreur lors de la suppression'
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => fetchPlanes())
</script>

<template>
  <div class="space-y-4">
    <p class="text-muted-foreground text-sm">
      Gérez les unités de type avion : nom, description et image.
    </p>

    <div class="flex justify-end">
      <Button @click="openCreate">
        <Plus class="h-4 w-4 mr-2" />
        Créer une unité
      </Button>
    </div>

    <Card class="border shadow-none p-0">
      <Table>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start w-20">Image</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Nom</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Description</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="error">
            <TableCell colspan="4" class="py-4">
              <p class="text-destructive text-sm">{{ error }}</p>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="loading">
            <TableCell colspan="4" class="text-center py-8 text-muted-foreground">
              Chargement...
            </TableCell>
          </TableRow>
          <TableRow v-else-if="planes.length === 0">
            <TableCell colspan="4" class="text-center py-8 text-muted-foreground">
              Aucune unité. Cliquez sur « Créer une unité » pour en ajouter.
            </TableCell>
          </TableRow>
          <TableRow
            v-else
            v-for="plane in planes"
            :key="plane.id"
            class="hover:bg-muted/10"
          >
            <TableCell class="w-20">
              <div class="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                <img
                  v-if="planeImageUrl(plane)"
                  :src="planeImageUrl(plane)!"
                  :alt="plane.name"
                  class="h-full w-full object-cover"
                />
                <ImageIcon v-else class="h-6 w-6 text-muted-foreground" />
              </div>
            </TableCell>
            <TableCell class="font-medium">{{ plane.name }}</TableCell>
            <TableCell class="text-muted-foreground text-sm max-w-xs truncate">
              {{ plane.description || '–' }}
            </TableCell>
            <TableCell class="text-end">
              <div class="flex justify-end gap-2">
                <Button variant="outline" size="sm" @click="openEdit(plane)" title="Modifier">
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" class="text-destructive" @click="confirmDelete(plane)" title="Supprimer">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <!-- Dialog création -->
    <Dialog v-model:open="createOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une unité avion</DialogTitle>
        </DialogHeader>
        <form @submit="submitCreate" class="space-y-4">
          <div class="space-y-2">
            <Label for="create-name">Nom</Label>
            <Input id="create-name" v-model="createName" placeholder="Ex. Chasseur léger" required />
          </div>
          <div class="space-y-2">
            <Label for="create-desc">Description</Label>
            <textarea
              id="create-desc"
              v-model="createDescription"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Description optionnelle"
            />
          </div>
          <div class="space-y-2">
            <Label>Image</Label>
            <div class="flex items-center gap-4">
              <div class="h-20 w-20 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                <img
                  v-if="createImagePreview"
                  :src="createImagePreview"
                  alt="Aperçu"
                  class="h-full w-full object-cover"
                />
                <ImageIcon v-else class="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <input
                  ref="createImageInputRef"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  class="hidden"
                  @change="onCreateImageChange"
                />
                <Button type="button" variant="outline" size="sm" @click="triggerCreateImageInput">
                  Choisir une image
                </Button>
                <p class="text-xs text-muted-foreground mt-1">PNG, JPEG, GIF ou WebP (max 5 Mo)</p>
              </div>
            </div>
          </div>
          <p v-if="createError" class="text-sm text-destructive">{{ createError }}</p>
          <DialogFooter>
            <Button type="button" variant="outline" @click="createOpen = false">Annuler</Button>
            <Button type="submit" :disabled="createLoading">
              {{ createLoading ? 'Création...' : 'Créer' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Dialog édition -->
    <Dialog v-model:open="editOpen" @update:open="(v: boolean) => !v && closeEdit()">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l'unité</DialogTitle>
        </DialogHeader>
        <form v-if="editingPlane" @submit="submitEdit" class="space-y-4">
          <input
            ref="imageUploadRef"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            class="hidden"
            @change="onImageChange"
          />
          <div class="space-y-2">
            <Label>Image</Label>
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                <img
                  v-if="planeImageUrl(editingPlane)"
                  :src="planeImageUrl(editingPlane)!"
                  :alt="editingPlane.name"
                  class="h-full w-full object-cover"
                />
                <ImageIcon v-else class="h-8 w-8 text-muted-foreground" />
              </div>
              <div class="space-y-1">
                <Button type="button" variant="outline" size="sm" :disabled="imageUploading" @click="triggerImageInput">
                  {{ imageUploading ? 'Upload...' : 'Choisir une image' }}
                </Button>
                <p class="text-xs text-muted-foreground">PNG, JPEG, GIF ou WebP (max 5 Mo)</p>
                <p v-if="imageUploadError" class="text-sm text-destructive">{{ imageUploadError }}</p>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <Label for="edit-name">Nom</Label>
            <Input id="edit-name" v-model="editName" placeholder="Nom" required />
          </div>
          <div class="space-y-2">
            <Label for="edit-desc">Description</Label>
            <textarea
              id="edit-desc"
              v-model="editDescription"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Description optionnelle"
            />
          </div>
          <p v-if="editError" class="text-sm text-destructive">{{ editError }}</p>
          <DialogFooter>
            <Button type="button" variant="outline" @click="closeEdit">Annuler</Button>
            <Button type="submit" :disabled="editLoading">
              {{ editLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Dialog suppression -->
    <Dialog v-model:open="deleteDialogOpen" @update:open="(v: boolean) => !v && closeDelete()">
      <DialogContent class="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Supprimer l'unité</DialogTitle>
        </DialogHeader>
        <p v-if="deleteTarget" class="text-sm text-muted-foreground">
          Êtes-vous sûr de vouloir supprimer « {{ deleteTarget.name }} » ?
        </p>
        <p v-if="deleteError" class="text-sm text-destructive">{{ deleteError }}</p>
        <DialogFooter>
          <Button type="button" variant="outline" @click="closeDelete">Annuler</Button>
          <Button variant="destructive" :disabled="deleteLoading" @click="submitDelete">
            {{ deleteLoading ? 'Suppression...' : 'Supprimer' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
