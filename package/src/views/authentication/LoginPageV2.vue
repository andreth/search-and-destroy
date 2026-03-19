<template>
  <div class="min-h-screen bg-[#0c0b09] text-gray-200 font-mono login-root">
    <!-- HUD background (décoratif uniquement) -->
    <div class="login-hud-bg" aria-hidden="true">
      <div class="hud-grid" />
      <div class="hud-scanlines" />
      <div class="hud-vignette" />
      <div class="hud-fog" />
      <div class="hud-noise" />

      <!-- Décors militaires (papier + scotch + tampons) -->
      <div class="hud-tape hud-tape-1">EVIDENCE</div>
      <div class="hud-tape hud-tape-2">SIGNAL OK</div>

      <div class="hud-paper hud-paper-1">
        <div class="hud-paper-title">TOP SECRET</div>
        <div class="hud-paper-line">OPERATION: RADAR-7</div>
        <div class="hud-paper-line hud-paper-muted">EYES ONLY</div>
      </div>

      <div class="hud-paper hud-paper-2">
        <div class="hud-paper-title">CONFIDENTIAL</div>
        <div class="hud-paper-line">SECURITY PROTOCOL</div>
        <div class="hud-paper-line hud-paper-muted">CLASS: GREEN</div>
      </div>

      <div class="hud-stamp hud-stamp-1">AUTHORIZED</div>
    </div>

    <div class="mx-auto max-w-7xl p-10 space-y-10 login-content">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-widest text-[#8B7D6B]">Search &amp; Destroy</p>
          <h1 class="text-2xl tracking-widest text-[#C4A882] uppercase">Accès sécurisé</h1>
        </div>
        <div class="text-xs text-gray-500">/auth/login2</div>
      </div>

      <LoginSection
        v-model:email="email"
        v-model:password="password"
        :mode="mode"
        :loading="loading"
        :error="error"
        @submit="onSubmit"
        @google="onGoogle"
        @toggleMode="mode = mode === 'login' ? 'register' : 'login'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { router } from '@/router'
import LoginSection from '@/components/pages/LoginSection.vue'

type Mode = 'login' | 'register'

const mode = ref<Mode>('login')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const authStore = useAuthStore()

// En dev : même origine → Vite proxy. En prod : VITE_API_URL.
const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')

const googleAuthUrl = computed(() => {
  const base = API_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const from = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''
  return `${base}/api/auth/google${from ? `?from=${from}` : ''}`
})

onMounted(() => {
  const q = router.currentRoute.value.query
  const e = typeof q.error === 'string' ? q.error : null
  if (e) {
    error.value = e
    router.replace({ path: '/auth/login2' }).catch(() => {})
  }
})

async function redirectAfterAuth() {
  if (!authStore.user) await authStore.fetchMe()

  const q = router.currentRoute.value.query
  const redirect = typeof q.redirect === 'string' ? q.redirect : null
  if (redirect) {
    await router.replace(redirect).catch(() => {})
    return
  }

  if (authStore.isAdmin) {
    await router.replace('/dashboard').catch(() => {})
  } else {
    await router.replace('/').catch(() => {})
  }
}

function onGoogle() {
  if (typeof window !== 'undefined') window.location.href = googleAuthUrl.value
}

async function onSubmit() {
  error.value = null
  loading.value = true

  try {
    const endpoint = mode.value === 'login' ? '/api/auth/signin/local' : '/api/auth/register'
    const res = await axios.post(`${API_URL}${endpoint}`, {
      email: email.value,
      password: password.value
    })

    const token = res.data
    authStore.setToken(token)
    await redirectAfterAuth()
  } catch (err: any) {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data ||
      (mode.value === 'login' ? 'Erreur lors de la connexion' : 'Erreur lors de l’inscription')
    error.value = typeof msg === 'string' ? msg : 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-root {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 18px;
}

.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.login-hud-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hud-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(196, 168, 130, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(196, 168, 130, 0.04) 1px, transparent 1px);
  background-size: 70px 70px;
  opacity: 0.4;
  mask-image: radial-gradient(circle at 40% 20%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 65%);
}

.hud-scanlines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0) 2px,
    rgba(196, 168, 130, 0.04) 3px,
    rgba(0, 0, 0, 0) 4px
  );
  opacity: 0.45;
  transform: translateZ(0);
  animation: hudScan 6s linear infinite;
}

@keyframes hudScan {
  0% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(12px);
  }
}

.hud-vignette {
  position: absolute;
  inset: -10%;
  background: radial-gradient(circle at 50% 20%, transparent 20%, rgba(0, 0, 0, 0.8) 80%);
  opacity: 0.9;
}

.hud-fog {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 35% at 20% 10%, rgba(196, 168, 130, 0.08), transparent 60%),
    radial-gradient(ellipse 45% 30% at 80% 40%, rgba(212, 169, 85, 0.06), transparent 65%),
    radial-gradient(ellipse 45% 30% at 50% 90%, rgba(139, 125, 107, 0.06), transparent 60%);
  filter: blur(12px);
  opacity: 0.95;
  animation: fogDrift 10s ease-in-out infinite;
}

@keyframes fogDrift {
  0% {
    transform: translate3d(-8px, -6px, 0) scale(1);
  }
  50% {
    transform: translate3d(10px, 6px, 0) scale(1.03);
  }
  100% {
    transform: translate3d(-8px, -6px, 0) scale(1);
  }
}

.hud-noise {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  mix-blend-mode: overlay;

  /* Bruit généré via SVG (pas besoin d'un fichier externe) */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
}

.hud-tape {
  position: absolute;
  pointer-events: none;
  height: 26px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  border: 1px dashed rgba(196, 168, 130, 0.35);
  background: rgba(12, 11, 9, 0.7);
  color: rgba(196, 168, 130, 0.85);
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  opacity: 0.8;
}

.hud-tape-1 {
  top: 18%;
  left: 8%;
  transform: rotate(-12deg);
}

.hud-tape-2 {
  top: 70%;
  right: 6%;
  transform: rotate(10deg);
}

.hud-paper {
  position: absolute;
  width: 260px;
  height: 170px;
  pointer-events: none;
  padding: 16px 16px 14px;
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgba(196, 168, 130, 0.08), rgba(0, 0, 0, 0.2)),
    repeating-linear-gradient(
      to bottom,
      rgba(196, 168, 130, 0.05) 0px,
      rgba(196, 168, 130, 0.05) 1px,
      transparent 1px,
      transparent 7px
    );
  border: 1px solid rgba(196, 168, 130, 0.2);
  color: rgba(212, 197, 169, 0.86);
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.5),
    inset 0 0 0 1px rgba(0, 0, 0, 0.25);
  opacity: 0.9;
  backdrop-filter: blur(2px);
  clip-path: polygon(2% 0%, 98% 0%, 100% 8%, 98% 98%, 0% 100%, 0% 8%);
}

.hud-paper-1 {
  top: 10%;
  left: 3%;
  transform: rotate(-8deg);
}

.hud-paper-2 {
  bottom: 14%;
  right: 5%;
  transform: rotate(7deg);
}

.hud-paper-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(212, 169, 85, 0.95);
  margin-bottom: 10px;
}

.hud-paper-line {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(209, 213, 219, 0.82);
  margin-top: 6px;
}

.hud-paper-muted {
  color: rgba(139, 125, 107, 0.8);
}

.hud-stamp {
  position: absolute;
  pointer-events: none;
  width: 170px;
  height: 170px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(212, 169, 85, 0.6);
  color: rgba(212, 169, 85, 0.8);
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.26em;
  transform: rotate(-12deg);
  opacity: 0.55;
  background: radial-gradient(circle at 30% 30%, rgba(212, 169, 85, 0.08), transparent 60%);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

.hud-stamp-1 {
  top: 22%;
  right: 18%;
}
</style>

