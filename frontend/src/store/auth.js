import { create } from 'zustand'

// localStorage helpers
const TOKEN_KEY = 'eco_token'
const USER_KEY = 'eco_user'
export const authStorage = {
  save(token, user) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clear() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY) },
  getToken() { return localStorage.getItem(TOKEN_KEY) },
  getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null } }
}

export const useAuthStore = create((set) => ({
  token: authStorage.getToken(),
  user: authStorage.getUser(),
  setAuth: (token, user) => { authStorage.save(token, user); set({ token, user }) },
  logout: () => { authStorage.clear(); set({ token: null, user: null }) },
}))