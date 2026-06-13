import axios from 'axios';

const API_URL = 'https://backend-kasirku.vercel.app';

// --- AMBIL SEMUA DATA KARYAWAN ---
export const getEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
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
// Fungsi ini yang dipanggil oleh tombol "Verifikasi" di halaman kelola
export const updateEmployeeStatus = async (id, status) => {
  try {
    // Kita mengirim object { status: 'AKTIF' } ke backend
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