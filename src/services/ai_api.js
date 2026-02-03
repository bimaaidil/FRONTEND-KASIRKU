// src/services/ai_api.js
import axios from 'axios';

// Alamat Python Flask Anda
const API_URL = 'http://127.0.0.1:5000/api';

export const getPredictionData = async (date) => {
  try {
    // Memanggil Python: GET http://127.0.0.1:5000/api/predict
    const response = await axios.get(`${API_URL}/predict`, {
      params: { target_date: date }
    });
    return response.data; // Mengembalikan data JSON dari Python
  } catch (error) {
    console.error("Gagal mengambil data dari Python:", error);
    return null;
  }
};