import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://iot-78c9.onrender.com/',
});

export const getAllDevices = async () => {
  try {
    const response = await axiosInstance.get('/devices');
    return response.data; 
  } catch (error) {
    throw error;  
  }
};

export const getDevicesById = async (id) => {
    try {
      const response = await axiosInstance.get(`/devices/${id}`);
      return response.data;
    } catch (error) {
      throw error;  
    }
  };
  

export const createDevices = async (device) =>{
    try {
        const response = await axiosInstance.post('/devices',device);
        return response.data; 
      } catch (error) {
        throw error;  
      }
}

export const UpdateDevice = async (id, device) =>{
    try {
        const response = await axiosInstance.put(`/devices/${id}`,device);
        return response.data; 
      } catch (error) {
        throw error;  
      }
}

export const DeleteDevice = async (id) =>{
    try {
        const response = await axiosInstance.delete(`/devices/${id}`);
        return response.data; 
      } catch (error) {
        throw error;  
      }
}

