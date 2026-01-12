import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const baseUrl = 'https://localhost:5000/api/sale'

export async function addSale(sale) {
  const session = useSessionStore()

  try {
    const response = await axios.post(
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

export async function generateCut(from, to) {
  const session = useSessionStore()

  try {
    const response = await axios.get(
      `${baseUrl}/cut`,
      {
        params: { from, to },
        headers: {
          Authorization: `Bearer ${session.token}`,
        }
      }
    )

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        msg: 'Corte generado exitosamente'
      }
    } else {
      return {
        success: false,
        msg: 'No se pudo procesar el corte'
      }
    }
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.msg || 'Error de conexión con el servidor'
    }
  }
}