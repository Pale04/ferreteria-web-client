import axios from 'axios'

const API_URL = 'http://localhost:5000/api/products'

export async function registerProduct(payload) {
  try {
    const response = await axios.post(API_URL, payload)
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response
    }
    throw new Error('NETWORK_ERROR')
  }
}
