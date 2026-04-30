import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api';

export const getPredictionData = async (date) => {
    try {
        // Kita kirim tanggal yang dipilih user ke backend
        const response = await axios.get(`${BASE_URL}/prediksi`, {
            params: { date: date }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching AI data:", error);
        return null;
    }
};