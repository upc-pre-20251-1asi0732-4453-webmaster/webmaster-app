import {environment} from "@/environment/environment.js";
import axios from "axios";

const token = localStorage.getItem('token');
const http = axios.create({
    baseURL: environment.baseUrl,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }

})


export class CandidatesService {

    async getAllCandidatesByProjectId(projectId) {
        const response = await http.get(`candidates-management/project/${projectId}`);
        return response.data;
    }


    async selectCandidate(projectId, candidateId) {
        const response = await http.patch(`candidates-management/project/${projectId}/candidate/${candidateId}/select`);
        return response.data;
    }


    async applyToAProject(projectId, candidateId) {
        const response = await http.post(`candidates-management/project/${projectId}/apply`, {developerId: candidateId});
        return response.data;


    }


}