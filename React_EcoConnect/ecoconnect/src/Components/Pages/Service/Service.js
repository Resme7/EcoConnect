
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const fetchRequestByCompanyId = (userId) => {
    return axios.get(`${API_BASE_URL}/users/company-id/${userId}`);
};

const fetchAllMaterials = () => {
    return axios.get(`${API_BASE_URL}/materials`);
};


const fetchCompaniesByMaterial = (material) => {
    return axios.get(`${API_BASE_URL}/companies/material/${material}`);
};

const fetchRequestsAccepted = (userId) => {
    return axios.get(`${API_BASE_URL}/companies/${userId}/accepted-request`);
};

const fetchRequestByPersonId = (userId) => {
    return axios.get(`http://localhost:8082/api/users/person-id/${userId}`);
};
 const deleteRequestById = (requestId) => {
    return axios.delete(`${API_BASE_URL}/requests/${requestId}`);
};
const fetchRequestHistoryByPersonId = (personId) => {
    return axios.get(`${API_BASE_URL}/requests/person/${personId}/requests`)};

const fetchRequestById = (requestId) => {
        return axios.get(`${API_BASE_URL}/requests/${requestId}`);
    };

const fetchMaterialById = (materialId) => {
        return axios.get(`${API_BASE_URL}/materials/${materialId}`);
    };

const createRequest = (userId, requestList) => {
    return axios.post(`${API_BASE_URL}/requests/${userId}`, requestList)
        .then(response => response)
        .catch(error => {
            console.error('Error in createRequest:', error);
            throw error;
        });
};


const updateRequestOnHold = (userId, requestOnHoldData) => {
    return axios.patch(`${API_BASE_URL}/requests/${userId}/accept`, requestOnHoldData);
};

const fetchNearbyCompaniesRadius = (personId, radius) => {
    return axios.get(`${API_BASE_URL}/users/nearby-companies/${personId}/${radius}`);
};

const fetchCompanyById = (companyId) => {
    return axios.get(`${API_BASE_URL}/companies/${companyId}`);
};
const fetchUserById = (userId) => {
    return axios.get(`${API_BASE_URL}/users/${userId}`);
};

const deleteUserById = (userId) => {
    return axios.delete(`${API_BASE_URL}/users/${userId}`);
};



export {fetchRequestsAccepted, fetchCompaniesByMaterial, fetchAllMaterials, fetchRequestByCompanyId, fetchCompanyById, deleteUserById, fetchUserById, fetchMaterialById, fetchRequestById, fetchRequestByPersonId, fetchRequestHistoryByPersonId,
     createRequest,deleteRequestById, updateRequestOnHold, fetchNearbyCompaniesRadius };


