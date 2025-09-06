import axios from 'axios'
import { authStorage } from '../store/auth'

// Axios instance
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach token from localStorage on each request
http.interceptors.request.use((config) => {
  const t = authStorage.getToken()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

// API functions
export const api = {
  async login(email, password) {
    const { data } = await http.post('/auth/login', { email, password })
    // data = { token }
    return data
  },
  async signup(email, password, username) {
    const { data } = await http.post('/auth/register', { email, password, username })
    // returns { message, user }
    return data
  },
  async me() {
    const { data } = await http.get('/auth/me')
    return data // { id, email, username, createdAt }
  }
}