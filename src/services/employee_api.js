// src/services/employee_api.js
import axios from 'react-native-axios' // atau 'axios' sesuai library utama proyekmu
import axios from 'axios';

// PERBAIKAN: Arahkan BASE URL langsung ke endpoint blueprint karyawan Flask (/api/karyawan)
const API_URL = 'https://backend-kasirku.vercel.app/api/karyawan';

// --- AMBIL SEMUA DATA KARYAWAN ---
export const getEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    
    // PENGAMAN DATA: Pastikan data yang dilempar kembali ke Login.jsx adalah murni Array data
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data.karyawan)) {
      return response.data.karyawan;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// --- TAMBAH KARYAWAN BARU ---
export const addEmployee = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// --- UPDATE DATA KARYAWAN (EDIT) ---
export const updateEmployee = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// --- UPDATE STATUS KARYAWAN (VERIFIKASI) ---
export const updateEmployeeStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating employee status:", error);
    throw error;
  }
};

// --- HAPUS KARYAWAN ---
export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};