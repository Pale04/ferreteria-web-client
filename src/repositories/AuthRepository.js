import axios from 'axios';

const API_URL = 'https://localhost:63369/api/auth';

export default {
    async login(credentials) {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    }
}