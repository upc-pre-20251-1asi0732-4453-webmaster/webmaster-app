import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {environment} from "@/environment/environment.js";

const token = localStorage.getItem('token');

const http = axios.create({
    baseURL: "http://localhost:5268/api/v1/",
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

export default {
    async createSupportRequest(supportRequest) {
        try {
            const token = localStorage.getItem('user id');
            if (!token) {
                throw new Error('Token not found');
            }

            const decodedToken = jwtDecode(token);
            const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
            if (!userId) {
                throw new Error('User ID not found in token');
            }

            supportRequest.append('userId', userId);

            const response = await http.post('/SupportRequest', supportRequest, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating support request:', error);
            console.log(error.response);
            throw error;
        }
    },

    async getSupportTickets() {
        try {
            const response = await http.get('/support-ticket');
            console.log('Tickets recibidos del backend:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error obteniendo tickets de soporte:', error);
            throw error;
        }
    },

    async resolveSupportTicket(ticketId) {
        try {
            const response = await http.patch(`/support-ticket/${ticketId}?is_resolved=true`);
            return response.data;
        } catch (error) {
            console.error('Error marcando ticket como resuelto:', error);
            throw error;
        }
    },
};