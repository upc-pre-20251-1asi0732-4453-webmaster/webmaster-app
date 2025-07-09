import axios from "axios";
import { environment } from "@/environment/environment.js";

const token = localStorage.getItem('token');

const http = axios.create({
    baseURL: environment.baseUrl,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

export class ProjectService {
    async getAllProjects() {
        const response = await http.get('/projects');
        return response.data;
    }

    async getProjectById(id) {
        const response = await http.get(`/projects/${id}`);
        return response.data;
    }

    async getProjectByDeveloper(developerUserId) {
        const response = await http.get(`/projects/developer/${developerUserId}`);
        return response.data;
        console.log("Respuesta del endpoint pa project",respons.data);
    }

    async getProjectByEnterprise(enterpriseUserId) {
        const response = await http.get(`/projects/enterprise/${enterpriseUserId}`);
        return response.data;
    }

    async createProject(project) {
        const response = await http.post(`/projects`, project);
        return response.data;
    }

    async updateProject(id, project) {
        const response = await http.put(`/projects/${id}`, project);
        return response.data;
    }

    async deleteProject(id) {
        const response = await http.delete(`/projects/${id}`);
        return response.data;
    }

    async assignDeveloper(projectId, data) {
        const response = await http.patch(`/projects/${projectId}/assign-developer`, data);
        return response.data;
    }

    async addApplicant(projectId, data) {
        const response = await http.patch(`/projects/${projectId}/add-candidate`, data);
        return response.data;
    }

    async getProgrammingLanguages() {
        const response = await http.get('/programming-languages');
        return response.data;
    }

    async getFrameworks() {
        const response = await http.get('/frameworks');
        return response.data;
    }

}

