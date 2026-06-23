// src/services/transaksi_api.js
import axios from 'axios';

const API_URL = 'https://backend-kasirku.vercel.app/api/transaksi';

// Mengambil seluruh histori transaksi penjualan dari Cloud Firestore
export const getTransaksiLogs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil histori transaksi dari cloud:", error);
    throw error;
  }
};