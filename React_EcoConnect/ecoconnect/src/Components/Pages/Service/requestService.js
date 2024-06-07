import axios from 'axios';

const API_URL = 'http://localhost:8082/api/requests';

export const getAllRequestsByUserId = async (userId) => {
  return await axios.get(`${API_URL}/person/${userId}/requests`);
};

export const acceptRequest = async (userId, requestId) => {
  return await axios.patch(`${API_URL}/${userId}/accept`, [{ id: requestId, dateRequestAccepted: new Date().toISOString() }]);
};

export const deleteRequest = async (requestId) => {
  return await axios.delete(`${API_URL}/${requestId}`);
};
