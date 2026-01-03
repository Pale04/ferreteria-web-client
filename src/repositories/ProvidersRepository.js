import axios from 'axios';

const url = 'http://localhost:5000/api/provider'

export async function addProvider(provider) {
  try {
    const response = await axios.post(url, provider, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    switch (response.status) {
      case 201:
        return {
          success: true,
          msg: 'Proveedor registrado exitosamente'
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

