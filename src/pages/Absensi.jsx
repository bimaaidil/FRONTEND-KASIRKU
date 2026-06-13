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
      const empData = await getEmployees();
      const cleanEmpData = Array.isArray(empData) 
        ? empData 
        : (empData?.data && Array.isArray(empData.data)) ? empData.data : [];

      const filteredEmps = cleanEmpData.filter(emp => {
        if (userRole === 'Admin') return false; 
        return emp.nama === userName; 
      });
      setEmployees(filteredEmps);
      if (filteredEmps.length > 0) {
        setSelectedEmp(filteredEmps[0].id);
      }
    } catch (error) { 
      console.error("Gagal ambil karyawan:", error); 
      setEmployees([]);
    }

    try {
      const attData = await getAttendance();
      const cleanAttData = Array.isArray(attData) 
        ? attData 
        : (attData?.data && Array.isArray(attData.data)) ? attData.data : [];

      setAttendanceList(cleanAttData);
    } catch (error) { 
      console.error("Gagal ambil riwayat kehadiran:", error);
      setAttendanceList([]); 
    } finally { setLoading(false); }
  };

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
    loadData();
    const timer = setInterval(() => { setWaktuSekarang(new Date()); }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchRekap();
  }, [bulanPilihan, attendanceList]);

  useEffect(() => {
    if (!selectedEmp || !Array.isArray(attendanceList)) { setStatusTombol('MASUK_REGULER'); return; }
    const todayStr = waktuSekarang.toISOString().split('T')[0];
    const myAtts = attendanceList.filter(a => a.employee_id === selectedEmp && a.date === todayStr);
    const reguler = myAtts.find(a => !a.jenis || a.jenis === 'Reguler');
    const lembur = myAtts.find(a => a.jenis === 'Lembur');

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

  const handleClockIn = async (jenis) => {
    if (!selectedEmp) return alert("Pilih nama Anda dulu!");
    const empObj = employees.find(e => e.id === selectedEmp);
    try {
        await axios.post(`${BASE_SERVER_URL}/api/absensi/clock-in`, {
            employee_id: selectedEmp,
            employee_name: empObj.nama,
            jenis_absen: jenis 
        });
        alert(jenis === 'Lembur' ? `Semangat Lemburnya, ${empObj.nama}!` : `Selamat bekerja, ${empObj.nama}!`);
        loadData(); 
    } catch (error) { alert(error.response?.data?.error || "Gagal absen masuk"); }
  };

  const handleClockOut = async () => {
    if (!selectedEmp) return alert("Pilih nama Anda dulu!");
    try {
        await clockOut(selectedEmp);
        alert("Hati-hati di jalan!");
        loadData(); 
    } catch (error) { alert(error.response?.data?.error || "Gagal absen pulang"); }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      {/* Main content adaptif margin untuk Mobile/PC */}
      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0', paddingBottom: '100px' }}>
        
        {/* HEADER RESPONSIVE */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
             <h2 className="fw-bold text-dark m-0" style={{ fontSize: '24px' }}>Absensi & Monitoring</h2>
             <p className="text-muted m-0" style={{ fontSize: '14px' }}>Selamat Datang, <strong>{userName}</strong></p>
          </div>

          <div className="d-flex align-items-center justify-content-between justify-content-md-end gap-3">
            <div className="text-muted small text-md-end">
              {waktuSekarang.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} 
              <br className="d-none d-md-block" /> 
              <span className="badge bg-secondary ms-1 ms-md-0">{waktuSekarang.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
            </div>
            
            <div className="d-flex align-items-center gap-2 p-1 pe-2 rounded" style={{ cursor: 'pointer', transition: '0.3s' }} onClick={() => navigate('/profile')}>
              <span className="fw-semibold small text-dark d-none d-sm-inline">{userName}</span>
              <FaUserCircle style={{ fontSize: '32px', color: '#154784' }} />
            </div>
          </div>
        </div>

        {/* ACTION CARD RESPONSIVE */}
        <div className="card border-0 shadow-sm p-4 mb-4 rounded-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <label className="form-label fw-medium text-secondary small">
                  {userRole === 'Admin' ? 'Admin Monitoring' : 'Konfirmasi Kehadiran'}
                </label>
                
                {userRole === 'Admin' ? (
                  <div className="text-muted small py-1">
                    Akun Admin tidak diperlukan untuk absen fisik harian.
                  </div>
                ) : (
                  <select className="form-select bg-light" value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
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
              <div className="w-100 d-flex justify-content-md-end">
                  {statusTombol === 'MASUK_REGULER' && (
                      <button className="btn btn-primary fw-bold w-100 w-md-auto px-4 py-2" onClick={() => handleClockIn('Reguler')}>
                          <FaClock className="me-2" /> ABSEN MASUK
                      </button>
                  )}
                  {statusTombol === 'PULANG_REGULER' && (
                      <button className="btn btn-danger fw-bold w-100 w-md-auto px-4 py-2" onClick={handleClockOut}>
                          <FaSignOutAlt className="me-2" /> PULANG SHIFT
                      </button>
                  )}
                  {statusTombol === 'MASUK_LEMBUR' && (
                      <div className="d-flex flex-column flex-sm-row align-items-center gap-2 w-100 w-md-auto">
                          <span className="text-success fw-bold small">Shift Selesai ✅</span>
                          <button className="btn btn-warning text-white fw-bold w-100 w-sm-auto px-4 py-2" onClick={() => handleClockIn('Lembur')}>
                              <FaBriefcase className="me-2" /> MULAI LEMBUR
                          </button>
                      </div>
                  )}
                  {statusTombol === 'PULANG_LEMBUR' && (
                      <button className="btn btn-danger fw-bold w-100 w-md-auto px-4 py-2" onClick={handleClockOut}>
                          <FaSignOutAlt className="me-2" /> SELESAI LEMBUR
                      </button>
                  )}
                  {statusTombol === 'SELESAI_TOTAL' && (
                      <button className="btn btn-success fw-bold w-100 w-md-auto px-4 py-2" disabled>
                          <FaCheckCircle className="me-2" /> TOTAL SELESAI
                      </button>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* RIWAYAT TABLE CARD RESPONSIVE */}
        <div className="card border-0 shadow-sm p-4 mb-4 rounded-3">
            <h3 className="fw-bold text-dark mb-3" style={{ fontSize: '16px' }}>
               {userRole === 'Admin' ? 'Riwayat Hari Ini (Semua)' : 'Riwayat Absensi Saya'}
            </h3>
            {loading ? (
              <div className="text-center py-3"><Loader className="animate-spin text-primary" /></div>
            ) : attendanceList.length === 0 ? (
              <div className="text-center text-muted small py-3">Belum ada riwayat hari ini.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle text-nowrap m-0">
                    <thead>
                        <tr className="text-secondary small text-uppercase">
                            <th className="border-0 pb-3">Tanggal</th>
                            <th className="border-0 pb-3">Nama</th>
                            <th className="border-0 pb-3">Jenis</th>
                            <th className="border-0 pb-3">Masuk</th>
                            <th className="border-0 pb-3">Pulang</th>
                            <th className="border-0 pb-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceList
                          .filter(item => userRole === 'Admin' ? true : item.employee_name === userName)
                          .slice(0, 5)
                          .map((item) => ( 
                            <tr key={item.id} className="border-top">
                                <td className="py-3 text-secondary">{item.date}</td>
                                <td className="py-3 fw-medium text-dark">{item.employee_name}</td>
                                <td className="py-3">
                                    <span className={`badge rounded-pill fw-bold ${(!item.jenis || item.jenis === 'Reguler') ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'}`} style={{ fontSize: '11px', padding: '4px 10px' }}>
                                        {(!item.jenis ? 'REGULER' : item.jenis.toUpperCase())}
                                    </span>
                                </td>
                                <td className="py-3 text-primary fw-medium">{item.clock_in}</td>
                                <td className="py-3 text-danger fw-medium">{item.clock_out}</td>
                                <td className="py-3 text-muted">{item.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            )}
        </div>

        {/* AREA OWNER ADMIN */}
        {userRole === 'Admin' && (
          <>
            <div className="my-5 position-relative text-center">
                <hr className="border-secondary border-dashed" />
                <span className="position-absolute top-50 start-50 translate-middle bg-light px-3 text-secondary fw-medium small" style={{ letterSpacing: '1px' }}>AREA MONITORING PEMILIK</span>
            </div>

            <div className="card border-0 shadow-sm p-4 rounded-3" style={{ borderTop: '5px solid #154784' }}>
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                    <div>
                        <h3 className="fw-bold text-dark m-0" style={{ fontSize: '18px' }}>
                            <FaChartLine className="me-2" style={{ color: '#154784' }}/> Rekapitulasi Kehadiran Bulanan
                        </h3>
                        <p className="text-muted small m-0 mt-1">Data kehadiran dan lembur untuk perhitungan gaji.</p>
                    </div>
                    <div className="d-flex gap-2 w-100 w-sm-auto">
                        <input type="month" className="form-control form-control-sm bg-light" style={{ maxWidth: '160px' }} value={bulanPilihan} onChange={(e) => setBulanPilihan(e.target.value)} />
                        <button className="btn btn-success btn-sm d-flex align-items-center gap-1 fw-medium" onClick={() => window.print()}>
                            <FaPrint size={12} /> Cetak
                        </button>
                    </div>
                </div>

                {loadingRekap ? (
                    <div className="text-center text-secondary py-4 small">Menghitung data...</div>
                ) : dataRekap.length === 0 ? (
                    <div className="text-center text-muted py-4 small">Tidak ada data rekap pada bulan ini.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle text-nowrap m-0">
                        <thead>
                            <tr className="bg-light text-secondary small text-uppercase">
                                <th className="ps-3 py-3">No</th>
                                <th className="py-3">Nama Karyawan</th>
                                <th className="py-3 text-center">Total Masuk</th>
                                <th className="py-3 text-center">Total Lembur</th>
                                <th className="py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataRekap.map((item, index) => (
                                <tr key={index} className="border-top">
                                    <td className="ps-3 py-3 text-muted">{index + 1}</td>
                                    <td className="py-3 fw-bold text-dark">{item.nama}</td>
                                    <td className="py-3 text-center">
                                        <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill">{item.total_hadir} Hari</span>
                                    </td>
                                    <td className="py-3 text-center">
                                         {item.total_lembur > 0 ? (
                                            <span className="badge bg-warning-subtle text-warning-baseline fw-bold px-3 py-2 rounded-pill">
                                                {item.total_lembur} Kali
                                            </span>
                                         ) : <span className="text-muted">-</span>}
                                    </td>
                                    <td className="py-3 text-success small fw-medium">Aktif</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Absensi;