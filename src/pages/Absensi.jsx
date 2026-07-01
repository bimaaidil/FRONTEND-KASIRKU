// src/pages/Absensi.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Sidebar from '../components/Sidebar';

// Import API terpadu
import { getEmployees } from '../services/employee_api'; 
import { getAttendance, clockIn, clockOut } from '../services/attendance_api'; 

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

  // State bantuan untuk membedakan mode tampilan HP secara real-time
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const empData = await getEmployees();
      const cleanEmpData = Array.isArray(empData) ? empData : (empData?.data || []);

      // Filter karyawan: Jika Admin, tampilkan SEMUA data karyawan. Jika Kasir, filter nama sendiri.
      const filteredEmps = cleanEmpData.filter(emp => {
        if (userRole === 'Admin') return true; 
        return emp.nama === userName; 
      });
      setEmployees(filteredEmps);
      
      if (filteredEmps.length > 0) {
        // Set default ke opsi "ALL" jika yang login adalah Admin agar tabel menarik semua data harian
        setSelectedEmp(userRole === 'Admin' ? 'ALL' : filteredEmps[0].id);
      }
    } catch (error) { 
      console.error("Gagal ambil karyawan:", error); 
    }

    try {
      const attData = await getAttendance();
      const cleanAttData = Array.isArray(attData) ? attData : (attData?.data || []);
      setAttendanceList(cleanAttData);
    } catch (error) { 
      console.error("Gagal ambil riwayat kehadiran:", error);
    } finally { 
      // PERBAIKAN UTAMA: Mengganti kata kunci 'filter' yang salah ketik kemarin menjadi 'finally' agar lolos build Vercel!
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => { setWaktuSekarang(new Date()); }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchRekap = async () => {
    if (!bulanPilihan || userRole !== 'Admin') return;
    setLoadingRekap(true);
    try {
      const response = await axios.get(`${BASE_SERVER_URL}/api/absensi/rekap-bulanan?bulan=${bulanPilihan}`);
      if (response.data && Array.isArray(response.data)) {
        setDataRekap(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setDataRekap(response.data.data);
      } else {
        setDataRekap([]);
      }
    } catch (error) {
      console.error("Gagal ambil rekap:", error);
      setDataRekap([]); 
    } finally {
      setLoadingRekap(false);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, [bulanPilihan, attendanceList]);

  // Logika Evaluasi Tombol Kehadiran Karyawan
  useEffect(() => {
    if (!selectedEmp || selectedEmp === 'ALL' || !Array.isArray(attendanceList)) { 
        setStatusTombol('MASUK_REGULER'); 
        return; 
    }
    const todayStr = waktuSekarang.toISOString().split('T')[0];
    const myAtts = attendanceList.filter(a => a.employee_id === selectedEmp && a.date === todayStr);
    
    const reguler = myAtts.find(a => !a.jenis || a.jenis.toLowerCase() === 'reguler');
    const lembur = myAtts.find(a => a.jenis && a.jenis.toLowerCase() === 'lembur');

    if (!reguler) {
        setStatusTombol('MASUK_REGULER');
    } else if (reguler.clock_out === '-') {
        setStatusTombol('PULANG_REGULER');
    } else {
        if (!lembur) {
            setStatusTombol('MASUK_LEMBUR');
        } else if (lembur.clock_out === '-') {
            setStatusTombol('PULANG_LEMBUR');
        } else {
            setStatusTombol('SELESAI_TOTAL');
        }
    }
  }, [selectedEmp, attendanceList, waktuSekarang]);

  const handleClockInAction = async (jenis) => {
    if (!selectedEmp || selectedEmp === 'ALL') return alert("Pilih nama Anda terlebih dahulu di dropdown!");
    const empObj = employees.find(e => e.id === selectedEmp);
    setLoading(true);
    try {
        await clockIn(selectedEmp, empObj.nama, jenis);
        alert(`Selamat, Absen ${jenis} Berhasil!`);
        setTimeout(() => { loadData(); }, 1200);
    } catch (error) { 
        alert(error.response?.data?.error || "Gagal melakukan absen masuk"); 
        setLoading(false);
    }
  };

  const handleClockOutAction = async () => {
    if (!selectedEmp || selectedEmp === 'ALL') return alert("Pilih nama Anda terlebih dahulu di dropdown!");
    setLoading(true);
    try {
        await clockOut(selectedEmp);
        alert("Absen pulang dikonfirmasi. Hati-hati di jalan!");
        setTimeout(() => { loadData(); }, 1200);
    } catch (error) { 
        alert("Gagal melakukan absen pulang"); 
        setLoading(false);
    }
  };

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    mainContent: { 
      marginLeft: isMobile ? '0px' : '260px', 
      flex: 1, 
      padding: isMobile ? '75px 15px 40px 15px' : '30px 40px', 
      paddingBottom: '100px',
      transition: 'margin 0.3s ease-in-out',
      width: '100%',
      overflowX: 'hidden'
    },
    header: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-end' : 'center', gap: '15px', marginBottom: '30px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0, paddingLeft: isMobile ? '45px' : '0' },
    profileNav: { display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '5px 10px', borderRadius: '10px', transition: '0.3s' },
    actionCard: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '30px' },
    select: { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', width: isMobile ? '100%' : '300px', outline: 'none', backgroundColor: '#f9fafb' },
    btnIn: { backgroundColor: '#2563eb', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: 'center' },
    btnOut: { backgroundColor: '#dc2626', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: 'center' },
    btnLembur: { backgroundColor: '#f59e0b', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: 'center' },
    btnDone: { backgroundColor: '#16a34a', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: 'center' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '15px' : '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '#40px' },
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
             <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', paddingLeft: isMobile ? '45px' : '0' }}>Selamat Datang, <strong>{userName}</strong></p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', width: isMobile ? '100%' : 'auto', justifyContent: 'space-between', paddingLeft: isMobile ? '45px' : '0' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', textAlign: isMobile ? 'left' : 'right' }}>
              {waktuSekarang.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
              <br /> 
              {waktuSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </div>
            
            <div style={styles.profileNav} onClick={() => navigate('/profile')}>
              <span style={{ fontWeight: '600', fontSize: '15px', color: '#1f2937' }} className="d-none d-sm-inline">{userName}</span>
              <FaUserCircle style={{ fontSize: '32px', color: '#154784' }} />
            </div>
          </div>
        </div>

        <div style={styles.actionCard}>
            <div style={{ width: isMobile ? '100%' : 'auto' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  {userRole === 'Admin' ? 'Admin Monitoring (Filter Karyawan)' : 'Konfirmasi Kehadiran'}
                </label>
                
                {userRole === 'Admin' ? (
                  <select style={styles.select} value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
                      <option value="ALL">-- Tampilkan Semua Karyawan --</option>
                      {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.nama} - {emp.posisi}</option>
                      ))}
                  </select>
                ) : (
                  <select style={styles.select} value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
                      {employees.length === 0 ? (
                        <option value="">Nama Anda tidak terdaftar</option>
                      ) : (
                        employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.nama} - {emp.posisi}</option>
                        ))
                      )}
                  </select>
                )}
            </div>
            
            {userRole !== 'Admin' && (
              <div style={{ width: isMobile ? '100%' : 'auto' }}>
                  {statusTombol === 'MASUK_REGULER' && (
                      <button style={styles.btnIn} onClick={() => handleClockInAction('Reguler')}>
                          <FaClock /> ABSEN MASUK
                      </button>
                  )}
                  {statusTombol === 'PULANG_REGULER' && (
                      <button style={styles.btnOut} onClick={handleClockOutAction}>
                          <FaSignOutAlt /> PULANG SHIFT
                      </button>
                  )}
                  {statusTombol === 'MASUK_LEMBUR' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                          <span style={{ color: '#059669', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' }}>Shift Selesai ✅</span>
                          <button style={styles.btnLembur} onClick={() => handleClockInAction('Lembur')}>
                              <FaBriefcase /> MULAI LEMBUR
                          </button>
                      </div>
                  )}
                  {statusTombol === 'PULANG_LEMBUR' && (
                      <button style={styles.btnOut} onClick={handleClockOutAction}>
                          <FaSignOutAlt /> SELESAI LEMBUR
                      </button>
                  )}
                  {statusTombol === 'SELESAI_TOTAL' && (
                      <button style={styles.btnDone} disabled>
                          <FaCheckCircle /> TOTAL SELESAI
                      </button>
                  )}
              </div>
            )}
        </div>

        <div style={styles.card}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
               {userRole === 'Admin' ? 'Riwayat Hari Ini (Semua)' : 'Riwayat Absensi Saya'}
            </h3>
            {loading ? <div style={{ textAlign: 'center', padding: '20px' }}><Loader className="animate-spin" /></div> : 
              attendanceList.length === 0 ? <div style={{ textAlign: 'center', color: '#9ca3af' }}>Belum ada riwayat hari ini.</div> : (
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }} className="table text-nowrap m-0">
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
                            .filter(item => {
                              if (userRole === 'Admin') {
                                if (selectedEmp === 'ALL') return true; 
                                return item.employee_id === selectedEmp; 
                              }
                              return item.employee_id === selectedEmp;
                            })
                            .slice(0, 10) 
                            .map((item) => ( 
                              <tr key={item.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                                  <td style={styles.tableCell}>{item.date}</td>
                                  <td style={{ ...styles.tableCell, fontWeight: '500' }}>{item.employee_name}</td>
                                  <td style={styles.tableCell}>
                                      <span style={(!item.jenis || item.jenis.toLowerCase() === 'reguler') ? styles.badgeReg : styles.badgeLembur}>
                                          {(!item.jenis ? 'REGULER' : item.jenis.toUpperCase())}
                                      </span>
                                  </td>
                                  <td style={{ ...styles.tableCell, color: '#2563eb' }}>{item.clock_in}</td>
                                  <td style={{ ...styles.tableCell, color: '#dc2626' }}>{item.clock_out}</td>
                                  <td style={styles.tableCell}>{item.status}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            )}
        </div>

        {userRole === 'Admin' && (
          <>
            <div style={{ borderTop: '2px dashed #cbd5e1', margin: '40px 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#F5F6FA', padding: '0 15px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>AREA MONITORING PEMILIK</span>
            </div>

            <div style={styles.rekapCard}>
                <div style={styles.rekapHeader}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaChartLine color="#154784"/> Rekapitulasi Kehadiran Bulanan
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '5px 0 0 0' }}>Data kehadiran dan lembur untuk perhitungan gaji.</p>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input 
                            type="month" 
                            style={styles.monthInput} 
                            value={bulanPilihan}
                            onChange={(e) => setBulanPilihan(e.target.value)}
                        />
                        <button style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }} onClick={() => window.print()}>
                            <FaPrint /> Cetak
                        </button>
                    </div>
                </div>

                {loadingRekap ? (
                    <div style={{textAlign: 'center', padding: '30px', color: '#6b7280'}}>Menghitung data...</div>
                ) : dataRekap.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '30px', color: '#9ca3af'}}>Tidak ada data rekap pada bulan ini.</div>
                ) : (
                    <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '10px'}}>
                        <thead>
                            <tr style={{backgroundColor: '#f8fafc'}}>
                                <th style={styles.tableHeader}>No</th>
                                <th style={styles.tableHeader}>Nama Karyawan</th>
                                <th style={styles.tableHeader}>Total Masuk</th>
                                <th style={styles.tableHeader}>Total Lembur</th>
                                <th style={styles.tableHeader}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataRekap.map((item, index) => (
                                <tr key={index} style={{borderBottom: '1px solid #f1f5f9'}}>
                                    <td style={styles.tableCell}>{index + 1}</td>
                                    <td style={{...styles.tableCell, fontWeight: 'bold'}}>{item.nama}</td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.totalBadge}>{item.total_hadir} Hari</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                         {item.total_lembur > 0 ? (
                                            <span style={{backgroundColor:'#fef3c7', color:'#92400e', padding:'5px 10px', borderRadius:'15px', fontWeight:'bold', fontSize:'12px'}}>
                                                {item.total_lembur} Kali
                                            </span>
                                         ) : <span style={{color:'#9ca3af'}}>-</span>}
                                    </td>
                                    <td style={{...styles.tableCell, color: '#059669', fontSize: '13px'}}>Aktif</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Absensi;