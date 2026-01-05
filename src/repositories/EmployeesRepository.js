import axios from 'axios';

const API_URL = 'https://localhost:5000/api/employees';

export default {
    async deleteEmployee(id){
        const token = localStorage.getItem('user_token');
        const response = await axios.put(`${API_URL}/${id}/delete`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async updateEmployee(id, employeeData) {
        const token = localStorage.getItem('user_token');
        const response = await axios.put(`${API_URL}/${id}`, employeeData, {
            headers: { Authorization: `Bearer ${token}`}
        });
        return response.data;
    },

    async getEmployeeById(id) {
        const token = localStorage.getItem('user_token');
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getActiveEmployees() {
        const token = localStorage.getItem('user_token');
        const response = await axios.get(`${API_URL}/active`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async registerEmployee(employeeData) {
        const token = localStorage.getItem('user_token');
        const response = await axios.post(API_URL, employeeData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
}