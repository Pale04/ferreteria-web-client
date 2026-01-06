import axios from 'axios';

const baseUrl = 'http://localhost:5000/api/provider'

export async function addProvider(provider) {
  const token = localStorage.getItem('user_token');
  try {
    const response = await axios.post(baseUrl, provider, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

export async function getProvider(id) {
  const token = localStorage.getItem('user_token');
  try {
    const response = await axios.get(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
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

export async function updateProvider(provider) {
  const token = localStorage.getItem('user_token');
  try {
    const response = await axios.put(`${baseUrl}/${provider.id}`, provider, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    switch (response.status) {
      case 204:
        return {
          success: true
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
      msg: error.response.data.msg
    }
  }
}

