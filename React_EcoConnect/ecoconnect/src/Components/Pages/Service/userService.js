import axios from 'axios';

const API_URL = 'http://localhost:8082/api/users';

export const getNearbyUsersForCompany = async (userId) => {
    return await axios.get(`${API_URL}/nearby-users-for-company/${userId}`);
  };