<template>
  <section class="grid grid-cols-2 gap-10 items-stretch">
    <BunkerPanel paddingClass="p-10">
      <h2 class="text-lg mb-5 tracking-widest text-[#C4A882]">
        {{ mode === 'login' ? 'Connexion' : 'Inscription' }}
      </h2>
      <div class="space-y-5">
        <MilitaryInput v-model="email" placeholder="Email" />
        <MilitaryInput v-model="password" type="password" placeholder="Mot de passe" />

        <MilitaryButton type="submit" :disabled="loading" @click="$emit('submit')">
          {{ loading ? '...' : (mode === 'login' ? 'Se connecter' : 'Créer un compte') }}
        </MilitaryButton>
        <MilitaryButton variant="secondary" type="button" @click="$emit('google')">
          {{ mode === 'login' ? 'Connexion Google' : 'Inscription Google' }}
        </MilitaryButton>

        <div class="pt-2.5 text-xs text-gray-400">
          <span>{{ mode === 'login' ? 'Pas de compte ?' : 'Déjà un compte ?' }}</span>
          <button type="button" class="ml-2 text-[#C4A882] hover:text-[#D4C5A9]" @click="$emit('toggleMode')">
            {{ mode === 'login' ? 'Créer un compte' : 'Se connecter' }}
          </button>
        </div>
      </div>
      <p v-if="error" class="mt-4 text-xs text-red-300">{{ error }}</p>
    </BunkerPanel>

    <BunkerPanel paddingClass="p-8">
      <TacticalMapPanel />
    </BunkerPanel>
  </section>
</template>

<script setup lang="ts">
import BunkerPanel from '../ui/BunkerPanel.vue'
import MilitaryInput from '../ui/MilitaryInput.vue'
import MilitaryButton from '../ui/MilitaryButton.vue'
import TacticalMapPanel from '../ui/TacticalMapPanel.vue'

defineProps<{
  mode?: 'login' | 'register'
  loading?: boolean
  error?: string | null
}>()

defineEmits<{
  submit: []
  google: []
  toggleMode: []
}>()

const email = defineModel<string>('email', { default: '' })
const password = defineModel<string>('password', { default: '' })
</script>
