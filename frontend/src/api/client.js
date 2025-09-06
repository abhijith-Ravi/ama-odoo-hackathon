
import axios from 'axios'
import { authStorage } from '../store/auth'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
})

http.interceptors.request.use((config) => {
  const t = authStorage.getToken()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})

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
    // backend returns { listings: [...] }
    return data.listings || []
  },
  async createProduct(body) {
    const { data } = await http.post('/products', body)
    // returns { message, listing }
    return data.listing
  },
  async getProduct(id) {
    const { data } = await http.get(`/products/${id}`)
    return data.listing || data.product
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
