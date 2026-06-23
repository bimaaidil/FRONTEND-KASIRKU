// src/services/kas_api.js
import axios from 'axios';

const API_URL = 'https://backend-kasirku.vercel.app/api/kas';

// Ambil semua histori kas dari cloud database
export const getKasLogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; 
  } catch (error) {
    console.error("Gagal memuat log kas dari server:", error);
    throw error;
  }
};

// Kirim data transaksi kas baru ke cloud database
export const saveKasLog = async (kasData) => {
  try {
    const response = await axios.post(API_URL, kasData);
    return response.data;
  } catch (error) {
    console.error("Gagal menyimpan log kas ke server:", error);
    throw error;
  }
};