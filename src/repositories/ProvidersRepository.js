import axios from 'axios';

export async function addProvider(provider) {
  try {
    const response = await axios.post('http://localhost:5000/api/provider', provider, {
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
    console.log(error)
    return {
      success: false,
      msg: 'Algo inesperado sucedió. Inténtelo más tarde'
    }
  }
}

