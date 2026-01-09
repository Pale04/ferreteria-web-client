import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const API_URL = 'https://localhost:5000/api'

export async function registerProduct(payload) {
  const session = useSessionStore()

  try {
    const response = await axios.post(
      `${API_URL}/products`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response
    }
    throw new Error('NETWORK_ERROR')
  }
}

export async function getProductsByCategory(categoryId) {
  const session = useSessionStore()

  const response = await axios.get(
    `${API_URL}/categories/${categoryId}/products`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    }
  )

  return response.data
}

export async function updateProduct(productId, payload) {
  const session = useSessionStore()

  try {
    const response = await axios.put(
      `http://localhost:5000/api/products/${productId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response
    }
    throw new Error('NETWORK_ERROR')
  }
}

export async function getProductsBySearchString(searchString) {
  const session = useSessionStore()

  try {
    const response = await axios.get(
    `${baseUrl}?s=${searchString}`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    })

    switch (response.status) {
      case 200:
        return {
          success: true,
          data: response.data
        };
      default:
        return {
          success: false,
          msg: response.data.msg
        };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.response.data.msg
    }
  }
}
