// src/services/ai_api.js
import axios from 'axios';

const BASE_URL = 'https://backend-kasirku.vercel.app';

// PERBAIKAN MUTLAK: Mengikat variabel ke window object agar terbaca secara global 
// oleh file index bundler vercel (Menyembuhkan ReferenceError rekap harian/bulanan)
window.BASE_SERVER_URL = BASE_URL;
const BASE_SERVER_URL = BASE_URL;

export const getPredictionData = async (date) => {
    try {
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