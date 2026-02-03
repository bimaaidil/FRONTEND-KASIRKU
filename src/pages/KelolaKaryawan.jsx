import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 
import { getEmployees, deleteEmployee } from '../services/employee_api'; // Import API

// Icon
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChartLine, FaPlus, FaTrash, FaEdit, FaSearch, FaUserTie } from 'react-icons/fa';
import { Loader } from 'lucide-react';

const KelolaKaryawan = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // --- HAPUS KARYAWAN ---
  const handleDelete = async (id, nama) => {
    if (window.confirm(`Hapus karyawan ${nama}?`)) {
      try {
        await deleteEmployee(id);
        fetchEmployees(); // Refresh tabel
      } catch (error) {
        alert("Gagal menghapus data.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Filter Search
  const filteredEmployees = employees.filter(emp =>
    emp.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles (Sama dengan Produk)
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
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    tableHeader: { textAlign: 'left', padding: '16px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6' },
    tableCell: { padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f9fafb' },
    btnAction: { border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }
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
        <div style={styles.menuItem} onClick={() => navigate('/absensi')}><FaCalendarCheck size={16} /> <span>Absensi</span></div>
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Fitur Cerdas</div>
        <div style={styles.menuItem} onClick={() => navigate('/prediksi')}><FaChartLine size={14} /> <span>Prediksi Stok</span></div>
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Karyawan</div>
        <div style={{...styles.menuItem, ...styles.activeMenu}}><FaUserFriends size={14} /> <span>Kelola Karyawan</span></div>
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
            ) : employees.length === 0 ? (
                <div style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}>Belum ada data karyawan.</div>
            ) : (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Nama Lengkap</th>
                            <th style={styles.tableHeader}>Posisi</th>
                            <th style={styles.tableHeader}>No Telepon</th>
                            <th style={styles.tableHeader}>Status</th>
                            <th style={styles.tableHeader}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.id} style={{borderBottom: '1px solid #f9fafb'}}>
                                <td style={{...styles.tableCell, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <div style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3730a3'}}>
                                        <FaUserTie size={14} />
                                    </div>
                                    {emp.nama}
                                </td>
                                <td style={styles.tableCell}>{emp.posisi}</td>
                                <td style={styles.tableCell}>{emp.no_hp}</td>
                                <td style={styles.tableCell}>
                                    <span style={{backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600'}}>AKTIF</span>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <button onClick={() => navigate(`/kelola-karyawan/edit/${emp.id}`)} style={{...styles.btnAction, backgroundColor: '#f3f4f6', color: '#4b5563'}}>
                                            <FaEdit /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(emp.id, emp.nama)} style={{...styles.btnAction, backgroundColor: '#fee2e2', color: '#dc2626'}}>
                                            <FaTrash /> Hapus
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