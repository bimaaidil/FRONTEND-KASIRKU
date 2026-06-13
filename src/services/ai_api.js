import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api';

export const getPredictionData = async (date) => {
    try {
        // Menambahkan parameter humidity agar Bi-LSTM mendapatkan data yang lebih lengkap
        const response = await axios.get(`${BASE_URL}/prediksi`, {
            params: { 
                date: date,
                // Pastikan backend Flask Anda juga dikonfigurasi untuk menerima/memproses kelembapan
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching AI data:", error);
        return null;
    }
};