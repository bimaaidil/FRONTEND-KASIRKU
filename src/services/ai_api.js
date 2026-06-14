// src/services/ai_api.js
import axios from 'axios';

const BASE_URL = 'https://backend-kasirku.vercel.app';

// PERBAIKAN 2: MENDEFINISIKAN BASE_SERVER_URL AGAR BEBAS DARI RUNTIME ERROR GLOBAL VERCEL
const BASE_SERVER_URL = BASE_URL;

export const getPredictionData = async (date) => {
    try {
        // Menambahkan parameter harian untuk kebutuhan komputasi jaringan cerdas Bi-LSTM
        const response = await axios.get(`${BASE_URL}/prediksi`, {
            params: { 
                date: date
            }
        });
        return response.data;
    } catch (error) {
        console.error("Gagal ambil rekap / Error fetching AI data:", error);
        return null;
    }
};