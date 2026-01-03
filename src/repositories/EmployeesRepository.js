import axios from 'axios';

const API_URL = 'https://localhost:5000/api/employees';

export default {
    async register(employeeData) {
        const token = localStorage.getItem('user_token');
        
        const response = await axios.post(API_URL, employeeData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
}