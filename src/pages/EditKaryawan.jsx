// src/pages/EditKaryawan.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployees, updateEmployee } from '../services/employee_api';
import logoImg from '../assets/LogoKasir.jpg'; 
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChartLine, FaSave, FaArrowLeft } from 'react-icons/fa';

const EditKaryawan = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari URL
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    nama: '',
    posisi: 'Kasir',
    no_hp: '',
    alamat: ''
  });

  // 1. Ambil Data Karyawan Lama
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEmployees = await getEmployees();
        const found = allEmployees.find(emp => emp.id === id);
        
        if (found) {
          setFormData({
            nama: found.nama,
            posisi: found.posisi,
            no_hp: found.no_hp,
            alamat: found.alamat
          });
        } else {
          alert("Karyawan tidak ditemukan!");
          navigate('/kelola-karyawan');
        }
      } catch (error) {
        console.error("Error load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Simpan Perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEmployee(id, formData);
      alert("Data karyawan berhasil diperbarui!");
      navigate('/kelola-karyawan');
    } catch (error) {
      alert("Gagal mengupdate data karyawan");
    } finally {
      setSaving(false);
    }
  };

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    sidebar: { width: '260px', backgroundColor: '#154784', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', position: 'fixed', height: '100vh', zIndex: 10 },
    logoSection: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '12px' },
    menuSectionTitle: { fontSize: '11px', color: '#a0c4eb', marginTop: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '5px' },
    menuItem: { padding: '8px 12px', marginBottom: '2px', borderRadius: '6px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', transition: '0.2s' },
    activeMenu: { backgroundColor: '#427dfc', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontWeight: '600' }, 
    divider: { borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 40px', backgroundColor: '#F5F6FA' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', width: '100%' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    fullWidthGroup: { gridColumn: '1 / -1', marginBottom: '10px' },
    formGroup: { marginBottom: '10px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', backgroundColor: '#f9fafb' },
    select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', backgroundColor: '#f9fafb' },
    btnSave: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' },
    btnBack: { backgroundColor: 'transparent', color: '#6b7280', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', marginBottom: '10px' }
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
        {/* Menu Aktif */}
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
        <div style={{ marginTop: 'auto', cursor: 'pointer', ...styles.menuItem }} onClick={() => navigate('/')}><FaSignOutAlt /> <span>Keluar</span></div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        <button style={styles.btnBack} onClick={() => navigate('/kelola-karyawan')}>
            <FaArrowLeft /> Kembali ke Daftar
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>Edit Karyawan</h2>

        <div style={styles.card}>
            {loading ? <p>Memuat data...</p> : (
            <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                    <div style={styles.fullWidthGroup}>
                        <label style={styles.label}>Nama Lengkap</label>
                        <input type="text" name="nama" style={styles.input} value={formData.nama} onChange={handleChange} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Posisi</label>
                        <select name="posisi" style={styles.select} value={formData.posisi} onChange={handleChange}>
                            <option value="Kasir">Kasir</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>No Handphone</label>
                        <input type="text" name="no_hp" style={styles.input} value={formData.no_hp} onChange={handleChange} />
                    </div>
                    <div style={styles.fullWidthGroup}>
                        <label style={styles.label}>Alamat</label>
                        <input type="text" name="alamat" style={styles.input} value={formData.alamat} onChange={handleChange} />
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button type="submit" style={styles.btnSave} disabled={saving}>
                        {saving ? "Menyimpan..." : <><FaSave /> Simpan Perubahan</>}
                    </button>
                </div>
            </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default EditKaryawan;