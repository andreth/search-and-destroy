<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table/index'
import { Card } from '@/components/ui/card/index'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Label from '@/components/ui/label/Label.vue'
import { Input } from '@/components/ui/input'
import { Pencil, ImageIcon } from 'lucide-vue-next'
import axios from 'axios'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')

interface Level {
  id: number
  levelNumber: number
  name: string
  description: string | null
  image: string | null
  createdAt: string
  updatedAt: string
}

const levels = ref<Level[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const editDialogOpen = ref(false)
const editingLevel = ref<Level | null>(null)
const editName = ref('')
const editDescription = ref('')
const editLoading = ref(false)
const editError = ref<string | null>(null)
const imageUploadRef = ref<HTMLInputElement | null>(null)
const imageUploading = ref(false)
const imageUploadError = ref<string | null>(null)

function levelImageUrl(level: Level): string | null {
  if (!level?.image) return null
  const base = API_URL || ''
  return `${base}/uploads/${level.image}`
}

function openEdit(level: Level) {
  editingLevel.value = level
  editName.value = level.name
  editDescription.value = level.description ?? ''
  editError.value = null
  editDialogOpen.value = true
}

function closeEdit() {
  editDialogOpen.value = false
  editingLevel.value = null
  imageUploadError.value = null
}

async function submitEdit(e: Event) {
  e.preventDefault()
  const level = editingLevel.value
  if (!level) return
  editError.value = null
  editLoading.value = true
  try {
    await axios.put(`${API_URL}/api/levels/${level.levelNumber}`, {
      name: editName.value.trim(),
      description: editDescription.value.trim() || null
    })
    closeEdit()
    fetchLevels()
  } catch (err: any) {
    const msg = err?.response?.data?.error
    editError.value = typeof msg === 'string' ? msg : 'Erreur lors de la mise à jour'
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
  if (!file || !editingLevel.value) return
  imageUploadError.value = null
  imageUploading.value = true
  try {
    const formData = new FormData()
    formData.append('image', file)
    const res = await axios.post(
      `${API_URL}/api/levels/${editingLevel.value.levelNumber}/image`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    if (editingLevel.value) {
      editingLevel.value = { ...editingLevel.value, image: res.data.image }
    }
    const idx = levels.value.findIndex((l) => l.levelNumber === editingLevel.value?.levelNumber)
    if (idx !== -1) levels.value[idx] = { ...levels.value[idx], image: res.data.image }
  } catch (err: any) {
    const msg = err?.response?.data?.error
    imageUploadError.value = typeof msg === 'string' ? msg : 'Erreur lors de l\'upload'
  } finally {
    imageUploading.value = false
    target.value = ''
  }
}

function fetchLevels() {
  loading.value = true
  error.value = null
  axios
    .get(`${API_URL}/api/levels`)
    .then((res) => { levels.value = Array.isArray(res.data) ? res.data : [] })
    .catch((err) => {
      levels.value = []
      error.value = err?.response?.data?.error || err?.message || 'Erreur réseau'
    })
    .finally(() => { loading.value = false })
}

onMounted(() => fetchLevels())
</script>

<template>
  <div class="space-y-4">
    <p class="text-muted-foreground text-sm">
      Les niveaux 1 à 15 sont utilisés pour la gamification des players. Vous pouvez personnaliser le nom et la description de chaque niveau.
    </p>

    <Card class="border shadow-none p-0">
      <Table>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start w-20">Icône</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start w-24">Niveau</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Nom</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-start">Description</TableHead>
            <TableHead class="text-base font-semibold whitespace-nowrap px-5 py-3 text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="error">
            <TableCell colspan="5" class="py-4">
              <p class="text-destructive text-sm">{{ error }}</p>
            </TableCell>
          </TableRow>
          <TableRow v-else-if="loading">
            <TableCell colspan="5" class="text-center py-8 text-muted-foreground">
              Chargement...
            </TableCell>
          </TableRow>
          <TableRow v-else-if="levels.length === 0">
            <TableCell colspan="5" class="text-center py-8 text-muted-foreground">
              Aucun niveau
            </TableCell>
          </TableRow>
          <TableRow
            v-else
            v-for="level in levels"
            :key="level.levelNumber"
            class="hover:bg-muted/10"
          >
            <TableCell class="w-20">
              <div class="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                <img
                  v-if="levelImageUrl(level)"
                  :src="levelImageUrl(level)!"
                  :alt="level.name"
                  class="h-full w-full object-cover"
                />
                <ImageIcon v-else class="h-5 w-5 text-muted-foreground" />
              </div>
            </TableCell>
            <TableCell class="font-medium">{{ level.levelNumber }}</TableCell>
            <TableCell>{{ level.name }}</TableCell>
            <TableCell class="text-muted-foreground text-sm max-w-xs truncate">
              {{ level.description || '–' }}
            </TableCell>
            <TableCell class="text-end">
              <Button variant="outline" size="sm" @click="openEdit(level)" title="Modifier">
                <Pencil class="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <Dialog v-model:open="editDialogOpen" @update:open="(v: boolean) => !v && closeEdit()">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le niveau {{ editingLevel?.levelNumber }}</DialogTitle>
        </DialogHeader>
        <form v-if="editingLevel" @submit="submitEdit" class="space-y-4">
          <input
            ref="imageUploadRef"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            class="hidden"
            @change="onImageChange"
          />
          <div class="space-y-2">
            <Label>Icône du grade</Label>
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                <img
                  v-if="editingLevel && levelImageUrl(editingLevel)"
                  :src="levelImageUrl(editingLevel)!"
                  :alt="editingLevel.name"
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
            <Input id="edit-name" v-model="editName" placeholder="Ex. Débutant, Expert..." required />
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
            <Button type="button" variant="outline" @click="closeEdit">
              Annuler
            </Button>
            <Button type="submit" :disabled="editLoading">
              {{ editLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
