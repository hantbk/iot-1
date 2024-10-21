import axios from 'axios';

// Cấu hình axios
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // URL gốc của API
});

// Hàm lấy danh sách thiết bị
export const getAllDevices = async () => {
  try {
    const response = await axiosInstance.get('/devices');
    return response.data;  // Trả về dữ liệu API nhận được
  } catch (error) {
    throw error;  
  }
};

export const getDevicesById = async (id) => {
    try {
      const response = await axiosInstance.get(`/devices/${id}`);
      return response.data;  // Trả về dữ liệu API nhận được
    } catch (error) {
      throw error;  
    }
  };
  


export const createDevices = async (device) =>{
    try {
        const response = await axiosInstance.post('/devices',device);
        return response.data;  // Trả về dữ liệu API nhận được
      } catch (error) {
        throw error;  
      }
}

export const UpdateDevice = async (id, device) =>{
    try {
        const response = await axiosInstance.put(`/devices/${id}`,device);
        return response.data;  // Trả về dữ liệu API nhận được
      } catch (error) {
        throw error;  
      }
}

export const DeleteDevice = async (id) =>{
    try {
        const response = await axiosInstance.delete(`/devices/${id}`);
        return response.data;  // Trả về dữ liệu API nhận được
      } catch (error) {
        throw error;  
      }
}

