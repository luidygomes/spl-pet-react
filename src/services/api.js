import axios from 'axios'

// Instância central. Todos os componentes usam este objeto.
// Nunca escreva a URL diretamente dentro de um componente.
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor de requisição:
// Antes de cada chamada, verifica se há token no localStorage
// e o adiciona automaticamente no header Authorization.
// Assim, as telas de triagem e dashboard não precisam fazer isso.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spl_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
