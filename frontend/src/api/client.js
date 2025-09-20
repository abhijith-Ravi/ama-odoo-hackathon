
import axios from 'axios'
import { authStorage } from '../store/auth'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

http.interceptors.request.use((config) => {
  const t = authStorage.getToken()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

export const apiOrigin = (() => {
  try {
    const u = new URL(import.meta.env.VITE_API_URL || 'http://localhost:3000/api')
    return `${u.protocol}//${u.hostname}${u.port ? ':' + u.port : ''}`
  } catch {
    return 'http://localhost:3000'
  }
})()

export const resolveImageUrl = (pathOrUrl) => {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${apiOrigin}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export const api = {
  // Auth
  async login(email, password) {
    const { data } = await http.post('/auth/login', { email, password })
    return data // { token }
  },
  async signup(email, password, username) {
    const { data } = await http.post('/auth/register', { email, password, username })
    return data // { message, user }
  },
  async me() {
    const { data } = await http.get('/auth/me')
    return data // { id, email, username, createdAt }
  },

  // Products
  async getProducts(params = {}) {
    const { data } = await http.get('/products', { params })
    return data.listings || []
  },

  // Accepts either plain object or FormData
  async createProduct(payload) {
    if (payload instanceof FormData) {
      const { data } = await http.post('/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.listing
    }
    const { data } = await http.post('/products', payload)
    return data.listing
  },

  async getProduct(id) {
    const { data } = await http.get(`/products/${id}`)
    return data
  },

  async updateProduct(id, body) {
    const { data } = await http.patch(`/products/${id}`, body)
    return data.product || data.listing
  },

  async deleteProduct(id) {
    const { data } = await http.delete(`/products/${id}`)
    return data
  },
}