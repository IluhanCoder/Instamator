import axios from 'axios'

// Use Vite env variable VITE_API_URL (e.g. http://localhost:5001/api) or default to '/api'
const base = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api

// attach token from localStorage for convenience in dev
api.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem('token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // ignore
  }
  return cfg
})
