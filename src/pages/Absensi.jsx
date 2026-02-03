// src/pages/Absensi.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 

// Import API
import { getEmployees } from '../services/employee_api'; 
import { getAttendance, clockIn, clockOut } from '../services/attendance_api';

import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChartLine, FaClock, FaCheckCircle } from 'react-icons/fa';
import { Loader } from 'lucide-react';

const Absensi = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [employees, setEmployees] = useState([]); // Daftar Karyawan
  const [attendanceList, setAttendanceList] = useState([]); // Riwayat Absen
  const [selectedEmp, setSelectedEmp] = useState(''); // ID Karyawan yang dipilih
  const [statusHariIni, setStatusHariIni] = useState('BELUM_ABSEN');

  // --- [PERBAIKAN UTAMA] FUNGSI LOAD DATA DIPISAH ---
  const loadData = async () => {
    setLoading(true);
    
    // 1. AMBIL DATA KARYAWAN (PASTI JALAN)
    try {
      const empData = await getEmployees();
      setEmployees(empData);
    } catch (error) {
      console.error("Gagal ambil karyawan:", error);
    }

    // 2. AMBIL DATA ABSENSI (KALAU ERROR, TIDAK GANGGU KARYAWAN)
    try {
      const attData = await getAttendance();
      setAttendanceList(attData);
    } catch (error) {
      console.error("Gagal ambil absensi (Mungkin DB Kosong/Rusak):", error);
      setAttendanceList([]); // Set kosong biar tidak crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- CEK STATUS ---
  useEffect(() => {
    if (!selectedEmp) {
        setStatusHariIni('BELUM_ABSEN');
        return;
    }
    // Cek status hari ini
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const myAttendance = attendanceList.find(
        a => a.employee_id === selectedEmp && a.date === today
    );

    if (myAttendance) {
        if (myAttendance.clock_out === '-') {
            setStatusHariIni('BEKERJA');
        } else {
            setStatusHariIni('SELESAI');
        }
    } else {
        setStatusHariIni('BELUM_ABSEN');
    }
  }, [selectedEmp, attendanceList]);

  // --- HANDLE TOMBOL ---
  const handleClockIn = async () => {
    if (!selectedEmp) return alert("Pilih nama Anda dulu!");
    const empObj = employees.find(e => e.id === selectedEmp);
    
    try {
        await clockIn(selectedEmp, empObj.nama);
        alert(`Selamat bekerja, ${empObj.nama}!`);
        loadData(); 
    } catch (error) {
        alert(error.response?.data?.error || "Gagal absen masuk");
    }
  };

  const handleClockOut = async () => {
    if (!selectedEmp) return alert("Pilih nama Anda dulu!");
    try {
        await clockOut(selectedEmp);
        alert("Hati-hati di jalan!");
        loadData(); 
    } catch (error) {
        alert(error.response?.data?.error || "Gagal absen pulang");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- STYLES (TIDAK BERUBAH) ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    sidebar: { width: '260px', backgroundColor: '#154784', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', position: 'fixed', height: '100vh', zIndex: 10 },
    logoSection: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '12px' },
    menuSectionTitle: { fontSize: '11px', color: '#a0c4eb', marginTop: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '5px' },
    menuItem: { padding: '8px 12px', marginBottom: '2px', borderRadius: '6px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', transition: '0.2s' },
    activeMenu: { backgroundColor: '#427dfc', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontWeight: '600' }, 
    divider: { borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 40px', backgroundColor: '#F5F6FA' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
    actionCard: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' },
    select: { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', width: '300px', outline: 'none' },
    btnIn: { backgroundColor: '#2563eb', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' },
    btnOut: { backgroundColor: '#dc2626', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' },
    btnDone: { backgroundColor: '#16a34a', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    tableHeader: { textAlign: 'left', padding: '16px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6' },
    tableCell: { padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f9fafb' },
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <img src={logoImg} alt="Logo" style={{ width: '35px', borderRadius: '5px' }} />
          <h4 className="m-0 fw-bold" style={{ fontSize: '18px' }}>Kasirku</h4>
        </div>
        <div style={styles.divider}></div>
        {/* Menu Aktif */}
        <div style={{...styles.menuItem, ...styles.activeMenu}}><FaCalendarCheck size={16} /> <span>Absensi</span></div>
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Fitur Cerdas</div>
        <div style={styles.menuItem} onClick={() => navigate('/prediksi')}><FaChartLine size={14} /> <span>Prediksi Stok</span></div>
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Karyawan</div>
        <div style={styles.menuItem} onClick={() => navigate('/kelola-karyawan')}><FaUserFriends size={14} /> <span>Kelola Karyawan</span></div>
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Barang</div>
        <div style={styles.menuItem} onClick={() => navigate('/kelola-produk')}><FaBox size={14} /> <span>Kelola Produk</span></div>
        <div style={styles.menuItem} onClick={() => navigate('/transaksi')}><FaExchangeAlt size={14} /> <span>Transaksi</span></div>  
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Laporan</div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-harian')}><FaFileAlt size={14} /> <span>Rekap Harian</span></div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-bulanan')}><FaFileAlt size={14} /> <span>Rekap Bulanan</span></div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-kas')}><FaFileAlt size={14} /> <span>Rekap Kas</span></div>
        <div style={{ marginTop: 'auto', cursor: 'pointer', ...styles.menuItem }} onClick={handleLogout}><FaSignOutAlt /> <span>Keluar</span></div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>Absensi Harian</h2>
          <div style={{fontSize: '14px', color: '#6b7280'}}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* CARD INPUT ABSEN */}
        <div style={styles.actionCard}>
            <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151'}}>Siapa Anda?</label>
                <select 
                    style={styles.select} 
                    value={selectedEmp} 
                    onChange={(e) => setSelectedEmp(e.target.value)}
                >
                    <option value="">-- Pilih Nama Karyawan --</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.nama} - {emp.posisi}</option>
                    ))}
                </select>
            </div>

            <div>
                {/* Logika Tombol Berubah Sesuai Status */}
                {statusHariIni === 'BELUM_ABSEN' && (
                    <button style={styles.btnIn} onClick={handleClockIn}>
                        <FaClock /> ABSEN MASUK
                    </button>
                )}
                
                {statusHariIni === 'BEKERJA' && (
                    <button style={styles.btnOut} onClick={handleClockOut}>
                        <FaSignOutAlt /> ABSEN PULANG
                    </button>
                )}

                {statusHariIni === 'SELESAI' && (
                    <button style={styles.btnDone} disabled>
                        <FaCheckCircle /> SUDAH SELESAI
                    </button>
                )}
            </div>
        </div>

        {/* TABEL RIWAYAT */}
        <div style={styles.card}>
            <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937'}}>Riwayat Kehadiran</h3>
            
            {loading ? (
                <div style={{textAlign: 'center', padding: '20px'}}><Loader className="animate-spin" /></div>
            ) : attendanceList.length === 0 ? (
                <div style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>Belum ada data absensi.</div>
            ) : (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Tanggal</th>
                            <th style={styles.tableHeader}>Nama Karyawan</th>
                            <th style={styles.tableHeader}>Jam Masuk</th>
                            <th style={styles.tableHeader}>Jam Pulang</th>
                            <th style={styles.tableHeader}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceList.map((item) => (
                            <tr key={item.id} style={{borderBottom: '1px solid #f9fafb'}}>
                                <td style={styles.tableCell}>{item.date}</td>
                                <td style={{...styles.tableCell, fontWeight: '500'}}>{item.employee_name}</td>
                                <td style={{...styles.tableCell, color: '#2563eb'}}>{item.clock_in}</td>
                                <td style={{...styles.tableCell, color: '#dc2626'}}>{item.clock_out}</td>
                                <td style={styles.tableCell}>
                                    <span style={{
                                        backgroundColor: item.status === 'Bekerja' ? '#dbeafe' : '#dcfce7',
                                        color: item.status === 'Bekerja' ? '#1e40af' : '#166534',
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
                                    }}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default Absensi;