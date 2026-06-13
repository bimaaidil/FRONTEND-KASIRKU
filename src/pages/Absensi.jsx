// src/pages/Absensi.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Sidebar from '../components/Sidebar';

// Import API
import { getEmployees } from '../services/employee_api'; 
import { getAttendance, clockOut } from '../services/attendance_api'; 

// Icons
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
      // Ambil Karyawan
      const empData = await getEmployees();
      const cleanEmpData = Array.isArray(empData) ? empData : (empData?.data || []);
      const filteredEmps = userRole === 'Admin' ? cleanEmpData : cleanEmpData.filter(e => e.nama === userName);
      setEmployees(filteredEmps);
      if (filteredEmps.length > 0 && !selectedEmp) setSelectedEmp(filteredEmps[0].id);

      // Ambil Kehadiran
      const attData = await getAttendance();
      setAttendanceList(Array.isArray(attData) ? attData : (attData?.data || []));
    } catch (error) { 
      console.error("Gagal memuat data:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchRekap = async () => {
    if (!bulanPilihan || userRole !== 'Admin') return;
    setLoadingRekap(true);
    try {
      const response = await axios.get(`${BASE_SERVER_URL}/api/absensi/rekap-bulanan?bulan=${bulanPilihan}`);
      setDataRekap(Array.isArray(response.data) ? response.data : (response.data.data || []));
    } catch (error) {
      setDataRekap([]);
    } finally {
      setLoadingRekap(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => { setWaktuSekarang(new Date()); }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchRekap();
  }, [bulanPilihan, attendanceList]);

  // Logika Status Tombol (Update otomatis saat attendanceList berubah)
  useEffect(() => {
    if (!selectedEmp || attendanceList.length === 0) {
        setStatusTombol('MASUK_REGULER');
        return;
    }
    
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
        await loadData(); // PENTING: Refresh data agar UI langsung update
    } catch (error) { 
        alert(error.response?.data?.error || "Gagal absen masuk"); 
    } finally { 
        setLoading(false); 
    }
  };

  const handleClockOut = async () => {
    if (!selectedEmp) return alert("Pilih nama Anda dulu!");
    setLoading(true);
    try {
        await clockOut(selectedEmp);
        alert("Hati-hati di jalan!");
        await loadData(); // PENTING: Refresh data agar UI langsung update
    } catch (error) { 
        alert("Gagal absen pulang"); 
    } finally { 
        setLoading(false); 
    }
  };

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 40px', paddingBottom: '100px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
    profileNav: { display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '5px 10px', borderRadius: '10px' },
    actionCard: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' },
    select: { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', width: '300px', outline: 'none', backgroundColor: '#f9fafb' },
    btnIn: { backgroundColor: '#2563eb', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center' },
    btnOut: { backgroundColor: '#dc2626', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center' },
    btnLembur: { backgroundColor: '#f59e0b', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center' },
    btnDone: { backgroundColor: '#16a34a', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'not-allowed', fontWeight: 'bold', display: 'flex', gap: '8px', alignItems: 'center' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '40px' },
    rekapCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderTop: '5px solid #154784' }, 
    tableHeader: { textAlign: 'left', padding: '16px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6' },
    tableCell: { padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f9fafb' },
    badgeReg: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
    badgeLembur: { backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
    totalBadge: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' },
    rekapHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    monthInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div>
             <h2 style={styles.pageTitle}>Absensi & Monitoring</h2>
             <p style={{margin:0, fontSize:'14px', color:'#6b7280'}}>Selamat Datang, <strong>{userName}</strong></p>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
            <div style={{fontSize: '14px', color: '#6b7280', textAlign:'right'}}>
              {waktuSekarang.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
              <br /> 
              {waktuSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </div>
            <div style={styles.profileNav} onClick={() => navigate('/profile')}>
              <span style={{ fontWeight: '600', fontSize: '15px' }}>{userName}</span>
              <FaUserCircle style={{ fontSize: '32px', color: '#154784' }} />
            </div>
          </div>
        </div>

        <div style={styles.actionCard}>
            <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>
                  {userRole === 'Admin' ? 'Admin Monitoring' : 'Konfirmasi Kehadiran'}
                </label>
                {userRole !== 'Admin' && (
                    <select style={styles.select} value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.nama} - {emp.posisi}</option>)}
                    </select>
                )}
            </div>
            
            {userRole !== 'Admin' && (
              <div>
                  {statusTombol === 'MASUK_REGULER' && <button style={styles.btnIn} onClick={() => handleClockIn('Reguler')}><FaClock /> ABSEN MASUK</button>}
                  {statusTombol === 'PULANG_REGULER' && <button style={styles.btnOut} onClick={handleClockOut}><FaSignOutAlt /> PULANG SHIFT</button>}
                  {statusTombol === 'MASUK_LEMBUR' && <button style={styles.btnLembur} onClick={() => handleClockIn('Lembur')}><FaBriefcase /> MULAI LEMBUR</button>}
                  {statusTombol === 'PULANG_LEMBUR' && <button style={styles.btnOut} onClick={handleClockOut}><FaSignOutAlt /> SELESAI LEMBUR</button>}
                  {statusTombol === 'SELESAI_TOTAL' && <button style={styles.btnDone} disabled><FaCheckCircle /> TOTAL SELESAI</button>}
              </div>
            )}
        </div>

        <div style={styles.card}>
            <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '20px'}}>Riwayat Kehadiran</h3>
            {loading ? <div style={{textAlign: 'center'}}><Loader /></div> : 
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                      <tr>
                          <th style={styles.tableHeader}>Tanggal</th>
                          <th style={styles.tableHeader}>Nama</th>
                          <th style={styles.tableHeader}>Jenis</th>
                          <th style={styles.tableHeader}>Masuk</th>
                          <th style={styles.tableHeader}>Pulang</th>
                          <th style={styles.tableHeader}>Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      {attendanceList
                        .filter(item => userRole === 'Admin' ? true : item.employee_name === userName)
                        .slice(0, 5)
                        .map((item) => ( 
                          <tr key={item.id} style={{borderBottom: '1px solid #f9fafb'}}>
                              <td style={styles.tableCell}>{item.date}</td>
                              <td style={styles.tableCell}>{item.employee_name}</td>
                              <td style={styles.tableCell}><span style={(!item.jenis || item.jenis === 'Reguler') ? styles.badgeReg : styles.badgeLembur}>{(!item.jenis ? 'REGULER' : item.jenis.toUpperCase())}</span></td>
                              <td style={styles.tableCell}>{item.clock_in}</td>
                              <td style={styles.tableCell}>{item.clock_out}</td>
                              <td style={styles.tableCell}>{item.status}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            }
        </div>
      </div>
    </div>
  );
};

export default Absensi;