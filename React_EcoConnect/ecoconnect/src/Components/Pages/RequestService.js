
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api/requests';

const fetchRequestsByUserId = (userId) => {
    return axios.get(`${API_BASE_URL}/person/${userId}/requests`);
};

const createRequest = (user,requestData) => {
    const userId = user.personId;
    return axios.post(`${API_BASE_URL}/${userId}`, requestData);
};


const updateRequestOnHold = (userId, requestOnHoldData) => {
    return axios.patch(`${API_BASE_URL}/${userId}/accept`, requestOnHoldData);
};


export { fetchRequestsByUserId, createRequest, updateRequestOnHold };


