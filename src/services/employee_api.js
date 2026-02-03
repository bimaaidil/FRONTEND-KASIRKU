import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/karyawan';

export const getEmployees = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addEmployee = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};