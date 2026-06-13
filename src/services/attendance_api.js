// src/services/attendance_api.js
import axios from 'axios';

// Menambahkan sub-route /api/absensi agar selaras dengan Blueprint Flask
const API_URL = 'https://backend-kasirku.vercel.app/api/absensi';

// Ambil Riwayat Absensi
export const getAttendance = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Kirim Absen Masuk
export const clockIn = async (employeeId, employeeName, jenisAbsen = 'Reguler') => {
  const response = await axios.post(`${API_URL}/clock-in`, { 
    employee_id: employeeId,
    employee_name: employeeName,
    jenis_absen: jenisAbsen
  });
  return response.data;
};

// Kirim Absen Pulang
export const clockOut = async (employeeId) => {
  const response = await axios.post(`${API_URL}/clock-out`, { 
    employee_id: employeeId 
  });
  return response.data;
};