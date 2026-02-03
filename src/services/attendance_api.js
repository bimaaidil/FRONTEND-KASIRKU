import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/absensi';

// Ambil Riwayat Absensi
export const getAttendance = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Kirim Absen Masuk
export const clockIn = async (employeeId, employeeName) => {
  const response = await axios.post(`${API_URL}/clock-in`, { 
    employee_id: employeeId,
    employee_name: employeeName
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