import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const API_URL = 'https://localhost:5000/api/categories'

export async function registerCategory(payload) {
  const session = useSessionStore()

  const response = await axios.post(API_URL, payload, {
    headers: {
      Authorization: `Bearer ${session.token}`,
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

export async function getActiveCategories() {
  const session = useSessionStore()

  const response = await axios.get(API_URL + '/active', {
    headers: {
      Authorization: `Bearer ${session.token}`
    }
  })

  return response.data
}
