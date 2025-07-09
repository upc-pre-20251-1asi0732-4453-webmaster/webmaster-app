import axios from 'axios';
import { environment } from "@/environment/environment.js";

const token = localStorage.getItem('token');

const http = axios.create({
    baseURL: environment.baseUrl,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

export class HomeService {

    getEnterpriseInfoByID(id) {
        return http.get(`/enterprise/${id}`);
    }

    getEnterpriseByUserId(userId) {
        return http.get(`/enterprise/${userId}`);
    }

    getDeveloperList() {
        return http.get('/developers');
    }

    getDevProfileByUserId(userId) {
        return http.get(`/developers/${userId}`);
    }

    getDevInfoByID(id) {
        return http.get(`/developers/${id}`);
    }

    updateDevInfo(id, data) {
        return http.put(`/developers/${id}`, data);
    }

    updateEnterpriseInfo(id, data) {
        return http.put(`/enterprise/${id}`, data);
    }

    updateDevProfileImg(id, data) {
        return http.put(`/developers/${id}/img`, data);
    }

    updateEnterpriseProfileImg(id, data) {
        return http.put(`/enterprise/${id}/img`, data);
    }
}
