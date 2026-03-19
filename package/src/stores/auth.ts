import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')
const AUTH_TOKEN_KEY = 'auth_token'

export interface AuthLevel {
  id: number
  levelNumber: number
  name: string
  image?: string | null
  xpRequired: number
}

export interface AuthUser {
  id: string
  username: string
  email: string
  role: 'admin' | 'player'
  isActive: boolean
  levelId?: number | null
  Level?: AuthLevel | null
  xp?: number
  createdAt?: string
  updatedAt?: string
}

export interface XpProgress {
  currentXp: number
  currentLevelXp: number
  nextLevelXp: number
  progress: number
  currentLevel: number
  currentLevelName: string
  nextLevelName: string
  currentLevelImage: string | null
  nextLevelImage: string | null
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  nextLevel: AuthLevel | null
  loading: boolean
  error: string | null
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: getStoredToken(),
    user: null,
    nextLevel: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated(state): boolean {
      return !!state.token
    },
    isPlayer(state): boolean {
      return state.user?.role === 'player'
    },
    isAdmin(state): boolean {
      return state.user?.role === 'admin'
    },
    xpProgress(state): XpProgress {
      const level = state.user?.Level
      const next = state.nextLevel
      const levelNum = level?.levelNumber ?? 1
      const xp = state.user?.xp ?? 0
      const currentLevelXp = level?.xpRequired ?? 0
      const nextLevelXp = next?.xpRequired ?? currentLevelXp + 500
      const rangeXp = nextLevelXp - currentLevelXp
      const progressXp = xp - currentLevelXp
      const progress = rangeXp > 0 ? Math.min(Math.max(progressXp / rangeXp, 0), 1) : 0

      return {
        currentXp: xp,
        currentLevelXp,
        nextLevelXp,
        progress,
        currentLevel: levelNum,
        currentLevelName: level?.name ?? `Niveau ${levelNum}`,
        nextLevelName: next?.name ?? `Niveau ${levelNum + 1}`,
        currentLevelImage: level?.image ?? null,
        nextLevelImage: next?.image ?? null
      }
    }
  },

  actions: {
    setToken(token: string) {
      this.token = token
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
      }
      this.error = null
    },

    setUser(user: AuthUser | null) {
      this.user = user
    },

    async fetchMe(): Promise<AuthUser | null> {
      if (!this.token) return null
      this.loading = true
      this.error = null
      try {
        const res = await axios.get<AuthUser>(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = res.data
        this.fetchNextLevel()
        return res.data
      } catch (e: any) {
        this.user = null
        this.nextLevel = null
        if (e?.response?.status === 401) {
          this.logout()
        }
        this.error = e?.response?.data?.error || 'Erreur lors du chargement du profil'
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchNextLevel() {
      const currentNum = this.user?.Level?.levelNumber
      if (currentNum == null) { this.nextLevel = null; return }
      try {
        const res = await axios.get<AuthLevel>(`${API_URL}/api/levels/${currentNum + 1}`)
        this.nextLevel = res.data
      } catch {
        this.nextLevel = null
      }
    },

    async grantXp(amount: number, reason?: string): Promise<{ leveledUp: boolean; xpGained: number } | null> {
      if (!this.token) return null
      try {
        const res = await axios.post(
          `${API_URL}/api/xp/grant`,
          { amount, reason },
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
        this.user = res.data.user
        if (res.data.leveledUp) {
          await this.fetchNextLevel()
        }
        return { leveledUp: res.data.leveledUp, xpGained: res.data.xpGained }
      } catch {
        return null
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.nextLevel = null
      this.error = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY)
      }
    }
  }
})
