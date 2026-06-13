// src/pages/Absensi.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Sidebar from '../components/Sidebar';
import { getEmployees } from '../services/employee_api'; 
import { getAttendance, clockOut } from '../services/attendance_api'; 
import { FaSignOutAlt, FaClock, FaCheckCircle, FaPrint, FaBriefcase, FaChartLine, FaUserCircle } from 'react-icons/fa';
import { Loader } from 'lucide-react';

const Absensi = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  const [employees, setEmployees] = useState([]); 
  const [attendanceList, setAttendanceList] = useState([]); 
  const [selectedEmp, setSelectedEmp] = useState(''); 
  const [statusTombol, setStatusTombol] = useState('MASUK_REGULER'); 
  const [waktuSekarang, setWaktuSekarang] = useState(new Date());
  const [bulanPilihan, setBulanPilihan] = useState(new Date().toISOString().slice(0, 7)); 
  const [dataRekap, setDataRekap] = useState([]);
  const [loadingRekap, setLoadingRekap] = useState(false);

  const BASE_SERVER_URL = 'https://backend-kasirku.vercel.app';

  const loadData = async () => {
    setLoading(true);
    try {
      const [empRes, attRes] = await Promise.all([getEmployees(), getAttendance()]);
      
      const cleanEmpData = Array.isArray(empRes) ? empRes : (empRes?.data || []);
      const filteredEmps = userRole === 'Admin' ? cleanEmpData : cleanEmpData.filter(e => e.nama === userName);
      setEmployees(filteredEmps);
      if (filteredEmps.length > 0 && !selectedEmp) setSelectedEmp(filteredEmps[0].id);

      setAttendanceList(Array.isArray(attRes) ? attRes : (attRes?.data || []));
    } catch (error) { 
      console.error("Gagal memuat data:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setWaktuSekarang(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Logika Tombol Dinamis
  useEffect(() => {
    if (!selectedEmp || attendanceList.length === 0) return;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const myAtts = attendanceList.filter(a => a.employee_id === selectedEmp && a.date === todayStr);
    
    const reguler = myAtts.find(a => !a.jenis || a.jenis === 'Reguler');
    const lembur = myAtts.find(a => a.jenis === 'Lembur');

    if (!reguler) {
        setStatusTombol('MASUK_REGULER');
    } else if (reguler.clock_out === '-') {
        setStatusTombol('PULANG_REGULER');
    } else if (!lembur) {
        setStatusTombol('MASUK_LEMBUR');
    } else if (lembur.clock_out === '-') {
        setStatusTombol('PULANG_LEMBUR');
    } else {
        setStatusTombol('SELESAI_TOTAL');
    }
  }, [selectedEmp, attendanceList]);

  const handleClockIn = async (jenis) => {
    if (!selectedEmp) return alert("Pilih nama Anda dulu!");
    const empObj = employees.find(e => e.id === selectedEmp);
    setLoading(true);
    try {
        await axios.post(`${BASE_SERVER_URL}/api/absensi/clock-in`, {
            employee_id: selectedEmp,
            employee_name: empObj.nama,
            jenis_absen: jenis 
        });
        alert(`Absen ${jenis} berhasil!`);
        // Jeda waktu untuk menunggu Firestore update di backend
        setTimeout(async () => { await loadData(); }, 1500); 
    } catch (error) { alert(error.response?.data?.error || "Gagal absen masuk"); } 
    finally { setLoading(false); }
  };

  const handleClockOut = async () => {
    if (!selectedEmp) return alert("Pilih nama Anda dulu!");
    setLoading(true);
    try {
        await clockOut(selectedEmp);
        alert("Absen pulang berhasil!");
        setTimeout(async () => { await loadData(); }, 1500);
    } catch (error) { alert("Gagal absen pulang"); }
    finally { setLoading(false); }
  };

  // ... (Gunakan JSX kamu yang sebelumnya, pastikan tetap menggunakan fungsi handleClockIn/Out di atas)
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        {/* Konten Absensi tetap sama */}
        {/* Pastikan tombol menggunakan statusTombol untuk render kondisional */}
      </div>
    </div>
  );
};

export default Absensi;