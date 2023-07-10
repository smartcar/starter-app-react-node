import axios from 'axios';

let api = {};

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER,
  // Allows cookies to be sent.
  withCredentials: true
});

api.axiosInstance = instance;

api.exchangeCode = async (code) => {
  // the backend will attach the accessToken as a session cookie, which will be needed to make requests to vehicle endpoints
  return await instance.get(`/exchange?code=${code}`);
};

api.getVehicles = async () => {
  const { data } = await instance.get(`/vehicles`);
  return data;
};

api.getVehicle = async (vehicleId) => {
  const { data } = await instance.get(`/vehicle`, {
    params: { vehicleId }
  });
  return data;
};

api.controlCharge = async (vehicleId, action) => {
  return await instance.post(
    '/vehicle/charge',
    { action },
    {
      params: { vehicleId }
    }
  );
};

api.setChargeLimit = async (vehicleId, limit) => {
  return await instance.post(
    '/vehicle/charge-limit',
    { limit },
    {
      params: { vehicleId }
    }
  );
};

api.setAmperage = async (vehicleId, amperage) => {
  return await instance.post(
    '/vehicle/amperage',
    { amperage },
    {
      params: { vehicleId }
    }
  );
};

api.disconnect = async (vehicleId) => {
  return await instance.delete('/vehicle', {
    params: { vehicleId }
  });
};

api.disconnectAll = async () => {
  return await instance.delete('/vehicles');
};

export default api;
