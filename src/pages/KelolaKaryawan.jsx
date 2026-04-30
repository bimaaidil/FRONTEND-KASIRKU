import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // <--- IMPORT SIDEBAR BARU

// Import API
import { getEmployees, deleteEmployee, updateEmployeeStatus } from '../services/employee_api'; 

// Icon yang hanya dipakai di dalam konten halaman
import { FaPlus, FaTrash, FaEdit, FaSearch, FaUserTie, FaCheckCircle } from 'react-icons/fa';
import { Loader } from 'lucide-react';

const KelolaKaryawan = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. AMBIL ROLE & PROTEKSI HALAMAN (URGENT!)
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    // Jika bukan Admin, tendang ke halaman Absensi
    if (userRole !== 'Admin') {
      alert("Akses Ditolak! Halaman ini hanya untuk Pemilik.");
      navigate('/absensi');
    }
  }, [userRole, navigate]);

  // --- AMBIL DATA DARI BACKEND ---
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Gagal ambil data karyawan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- VERIFIKASI KARYAWAN ---
  const handleVerify = async (id, nama) => {
    if (window.confirm(`Aktifkan akun karyawan ${nama}?`)) {
      try {
        await updateEmployeeStatus(id, 'AKTIF');
        alert(`Karyawan ${nama} berhasil diverifikasi!`);
        fetchEmployees(); 
      } catch (error) {
        alert("Gagal memverifikasi data.");
      }
    }
  };

  // --- HAPUS KARYAWAN ---
  const handleDelete = async (id, nama) => {
    if (window.confirm(`Hapus karyawan ${nama}?`)) {
      try {
        await deleteEmployee(id);
        fetchEmployees(); 
      } catch (error) {
        alert("Gagal menghapus data.");
      }
    }
  };

  // Filter Search
  const filteredEmployees = employees.filter(emp =>
    emp.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles (Sudah dibersihkan dari gaya Sidebar)
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 40px', backgroundColor: '#F5F6FA' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    tableHeader: { textAlign: 'left', padding: '16px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6' },
    tableHeaderAksi: { textAlign: 'center', padding: '16px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6', width: '280px' },
    tableCell: { padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f9fafb' },
    actionContainer: { display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' },
    btnAction: { border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', whiteSpace: 'nowrap' },
    badgeAktif: { backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
    badgePending: { backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }
  };

  return (
    <div style={styles.container}>
      {/* 1. PANGGIL SIDEBAR TUNGGAL */}
      <Sidebar />

      {/* 2. MAIN CONTENT (Mulai dari 260px) */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>Data Karyawan</h2>
          <div style={{display: 'flex', gap: '15px'}}>
            <div style={{display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '0 15px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '250px'}}>
                <FaSearch color="#9ca3af" />
                <input type="text" placeholder="Cari karyawan..." style={{border: 'none', outline: 'none', padding: '10px', width: '100%'}} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            <button onClick={() => navigate('/tambah-karyawan')} style={{backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500'}}>
                <FaPlus size={14} /> Tambah Karyawan
            </button>
          </div>
        </div>

        <div style={styles.card}>
            {loading ? (
                <div style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}><Loader className="animate-spin" style={{margin: '0 auto 10px'}} /> Memuat Data...</div>
            ) : filteredEmployees.length === 0 ? (
                <div style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}>Tidak ada data karyawan yang ditemukan.</div>
            ) : (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Nama Lengkap</th>
                            <th style={styles.tableHeader}>Posisi</th>
                            <th style={styles.tableHeader}>No Telepon</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeaderAksi}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.id} style={{borderBottom: '1px solid #f9fafb'}}>
                                <td style={{...styles.tableCell, fontWeight: '500'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%', 
                                            backgroundColor: emp.status === 'AKTIF' ? '#e0e7ff' : '#f3f4f6', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                            color: emp.status === 'AKTIF' ? '#3730a3' : '#9ca3af'
                                        }}>
                                            <FaUserTie size={14} />
                                        </div>
                                        {emp.nama}
                                    </div>
                                </td>
                                <td style={styles.tableCell}>{emp.posisi}</td>
                                <td style={styles.tableCell}>{emp.no_hp}</td>
                                <td style={styles.tableCell}>
                                    <span style={emp.status === 'AKTIF' ? styles.badgeAktif : styles.badgePending}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={styles.actionContainer}>
                                        {emp.status !== 'AKTIF' && (
                                            <button onClick={() => handleVerify(emp.id, emp.nama)} style={{...styles.btnAction, backgroundColor: '#2563eb', color: 'white'}}>
                                                <FaCheckCircle size={12} /> Verifikasi
                                            </button>
                                        )}

                                        <button onClick={() => navigate(`/kelola-karyawan/edit/${emp.id}`)} style={{...styles.btnAction, backgroundColor: '#f3f4f6', color: '#4b5563'}}>
                                            <FaEdit size={12} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(emp.id, emp.nama)} style={{...styles.btnAction, backgroundColor: '#fee2e2', color: '#dc2626'}}>
                                            <FaTrash size={12} /> Hapus
                                        </button>
                                    </div>
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

export default KelolaKaryawan;