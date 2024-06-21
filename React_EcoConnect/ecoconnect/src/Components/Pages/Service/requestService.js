import axios from 'axios';

const API_URL = 'http://localhost:8082/api/requests';

export const getAllRequestsByUserId = async (userId) => {
  return await axios.get(`${API_URL}/person/${userId}/requests`);
};
export const getAllRequestsOnHold = async (personId) => {
  return await axios.get(`${API_URL}/person/${personId}/requests-onhold`)
}

export const finishRequest = ( requestId) => {
  const payload = {
    "id": requestId,
    "status": "COMPLETED"
}
  console.log("Payload: ", payload)
  return axios.patch(`${API_URL}/${requestId}/finish`,payload);
};

export const getRequestsOrderByQuantity = async (personId) => {
  return await axios.get(`${API_URL}/person/${personId}/requests-ordered-by-quantity`)
}

export const acceptRequest = (companyId, requestId, dateTime) => {
  const url = `${API_URL}/${companyId}/accept`;
  console.log(`Calling acceptRequest with companyId: ${companyId} and requestId: ${requestId}`);
  console.log(`URL: ${url}`);
  const payload = [
    {
        "id": requestId,
        "dateRequestAccepted": dateTime
    }
]

  console.log("Payload:", JSON.stringify(payload));

  return axios.patch(url, payload, {
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      console.log(`Response status: ${response.status}`);
      console.log('Response data:', response.data);
      if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
  })
  .catch(error => {
      console.error('Error in acceptRequest:', error.response ? error.response.data : error.message);
      throw error;
  });
};


export const deleteRequest = async (requestId) => {
  return await axios.delete(`${API_URL}/${requestId}`);
};


