// src/pages/EditProduk.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts, updateProduct } from '../services/product_api';
import logoImg from '../assets/LogoKasir.jpg'; 
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChartLine, FaSave, FaArrowLeft } from 'react-icons/fa';

const EditProduk = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil ID dari URL
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Makanan',
    harga: '',
    stok: ''
  });

  // Ambil data produk berdasarkan ID saat halaman dibuka
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const allProducts = await getProducts();
        const found = allProducts.find(p => p.id === id);
        
        if (found) {
          setFormData({
            nama: found.nama,
            kategori: found.kategori,
            harga: found.harga,
            stok: found.stok
          });
        } else {
          alert("Produk tidak ditemukan!");
          navigate('/kelola-produk');
        }
      } catch (error) {
        console.error("Error ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = {
          ...formData,
          harga: parseInt(formData.harga),
          stok: parseInt(formData.stok)
      };

      await updateProduct(id, dataToSend);
      alert("Produk berhasil diperbarui!");
      navigate('/kelola-produk'); 
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengupdate produk.");
    } finally {
      setSaving(false);
    }
  };

  // --- STYLES (Sama dengan TambahProduk agar konsisten) ---
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
        <div style={styles.menuItem} onClick={() => navigate('/kelola-karyawan')}><FaUserFriends size={14} /> <span>Kelola Karyawan</span></div>
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Barang</div>
        <div style={{...styles.menuItem, ...styles.activeMenu}}><FaBox size={14} /> <span>Kelola Produk</span></div>
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
        <button style={styles.btnBack} onClick={() => navigate('/kelola-produk')}>
            <FaArrowLeft /> Kembali ke Daftar
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '30px' }}>Edit Produk</h2>

        <div style={styles.card}>
            {loading ? <p>Memuat data...</p> : (
            <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                    <div style={styles.fullWidthGroup}>
                        <label style={styles.label}>Nama Produk</label>
                        <input type="text" name="nama" style={styles.input} value={formData.nama} onChange={handleChange} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Kategori</label>
                        <select name="kategori" style={styles.select} value={formData.kategori} onChange={handleChange}>
                            <option value="Makanan">Makanan</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Bahan Baku">Bahan Baku</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Harga Jual (Rp)</label>
                        <input type="number" name="harga" style={styles.input} value={formData.harga} onChange={handleChange} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Stok</label>
                        <input type="number" name="stok" style={styles.input} value={formData.stok} onChange={handleChange} />
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

export default EditProduk;