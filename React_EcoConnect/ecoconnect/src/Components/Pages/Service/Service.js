
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const fetchRequestByPersonId = (userId) => {
    return axios.get(`http://localhost:8082/api/users/person-id/${userId}`);
};
 const deleteRequestById = (requestId) => {
    return axios.delete(`${API_BASE_URL}/requests/${requestId}`);
};
const fetchRequestHistoryByPersonId = (personId) => {
    return axios.get(`${API_BASE_URL}/requests/history/${personId}`)};

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

const fetchNearbyCompanies = (personId) => {
    return axios.get(`${API_BASE_URL}/companies`);
};

const fetchCompanyPracticeInfo = () => {
    return axios.get('http://localhost:8082/api/users/companies/practice-info');
};


export {fetchCompanyPracticeInfo, fetchMaterialById, fetchRequestById, fetchRequestByPersonId, fetchRequestHistoryByPersonId, createRequest,deleteRequestById, updateRequestOnHold, fetchNearbyCompanies };


