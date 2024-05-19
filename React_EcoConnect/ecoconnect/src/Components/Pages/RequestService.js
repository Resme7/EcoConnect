
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api/requests';

const fetchRequestByPersonId = (userId) => {
    return axios.get(`http://localhost:8082/api/users/person-id/${userId}`);
};

const createRequest = (userId, requestList) => {
    return axios.post(`${API_BASE_URL}/${userId}`, requestList)
        .then(response => response)
        .catch(error => {
            console.error('Error in createRequest:', error);
            throw error;
        });
};


const updateRequestOnHold = (userId, requestOnHoldData) => {
    return axios.patch(`${API_BASE_URL}/${userId}/accept`, requestOnHoldData);
};


export { fetchRequestByPersonId, createRequest, updateRequestOnHold };


