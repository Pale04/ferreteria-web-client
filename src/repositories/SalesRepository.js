import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const baseUrl = 'http://localhost:5000/api/sale'

export async function addSale(sale) {
  const session = useSessionStore()

  try {
    const response = await axios.get(
    baseUrl,
    sale,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      }
    })

    switch (response.status) {
      case 201:
        return {
          success: true,
          data: response.data,
          msg: 'La venta fue registrada exitosamente'
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
