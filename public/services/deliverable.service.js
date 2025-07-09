import axios from 'axios';
import {environment} from "@/environment/environment.js";

const token = localStorage.getItem('token');

const http = axios.create({
    baseURL: environment.baseUrl,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

export class DeliverableService{

    async getAllDeliverables(projectId) {
        const response = await http.get(`/Projects/${projectId}/deliverables`);
        return response.data;
    }

    async getDeliverableById(projectId, deliverableId) {
        const response = await http.get(`/Projects/${projectId}/deliverables/${deliverableId}`);
        return response.data;
    }

    async createDeliverable(projectId, deliverable) {
        const response = await http.post(`/Projects/${projectId}/deliverables`, deliverable);
        return response.data;
    }

    async updateDeliverable(projectId, deliverableId, deliverable) {
        const response = await http.put(`/Projects/${projectId}/deliverables/${deliverableId}`, deliverable);
        return response.data;
    }

    async deleteDeliverable(projectId, orderNumber) {
        const response = await http.delete(`/Projects/${projectId}/deliverables/${orderNumber}`);
        return response.data;
    }

    async uploadDeliverableFile(projectId, deliverableId, uploadFile) {
        const response = await http.patch(`/Projects/${projectId}/deliverables/${deliverableId}/upload`, uploadFile);
        return response.data;
    }

    async approveDeliverable(projectId, deliverableId) {
        const response = await http.patch(`/Projects/${projectId}/deliverables/${deliverableId}/Approve`);
        return response.data;
    }

    async rejectDeliverable(projectId, deliverableId) {
        const response = await http.put(`/Projects/${projectId}/deliverables/${deliverableId}/Reject`);
        return response.data;
    }

    async reviewDeliverable(projectId, deliverableId, isApproved) {
        const response = await http.patch(`/Projects/${projectId}/deliverables/${deliverableId}/review`, isApproved);
        return response.data;
    }

}
