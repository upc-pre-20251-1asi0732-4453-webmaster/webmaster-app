import axios from 'axios';
import { environment } from "../../src/environment/environment.js";

const token = localStorage.getItem('token');

const http = axios.create({
    baseURL: environment.baseUrl,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

export class AuthService {

    async authenticate(userEmail, password) {
        try {
            const response = await http.post('/authentication/sign-in', {
                userEmail,
                password
            });
            const { token } = response.data;

            // Guarda el token en localStorage
            localStorage.setItem('token', token);
            return response.data;
        } catch (error) {
            console.error('Error en la autenticación:', error);
            throw error;
        }
    }

    async registerDeveloper(developer) {
        const response = await http.post('/authentication/sign-up/developer', {
            userEmail: developer.username,
            password: developer.password,
            firstName: developer.firstName,
            lastName: developer.lastName
        });
        return response.data;
    }

    async registerEnterprise(enterprise) {
        const response = await http.post('/authentication/sign-up/enterprise', {
            userEmail: enterprise.username,
            password: enterprise.password,
            enterpriseName: enterprise.enterpriseName
        });
        return response.data;
    }
}
