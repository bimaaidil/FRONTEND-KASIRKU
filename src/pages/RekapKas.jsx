// src/pages/RekapKas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChevronRight, FaChartLine } from 'react-icons/fa';

const RekapKas = () => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState('');
  const [showMasukModal, setShowMasukModal] = useState(false);
  const [showKeluarModal, setShowKeluarModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    setCurrentDate(date.toLocaleDateString('id-ID', options));
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- LOGIKA SIMPAN KE LOCALSTORAGE ---
  const handleSave = (type) => {
    if (!amount || !description) {
        alert("Mohon lengkapi semua data!");
        return;
    }

    // 1. Ambil data lama
    const existingData = JSON.parse(localStorage.getItem('kasData')) || [];

    // 2. Buat objek data baru
    const newTransaction = {
        id: Date.now(), // ID unik berdasarkan waktu
        type: type, // 'Uang Masuk' atau 'Uang Keluar'
        amount: parseInt(amount),
        description: description, // Catatan (misal: Es batu)
        date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        user: 'Bima' // Hardcode nama user sesuai gambar
    };

    // 3. Simpan kembali ke LocalStorage
    localStorage.setItem('kasData', JSON.stringify([newTransaction, ...existingData]));

    alert(`Berhasil menyimpan ${type}`);
    
    // Reset
    setAmount('');
    setDescription('');
    setShowMasukModal(false);
    setShowKeluarModal(false);
  };

  const handleCancel = () => {
    setAmount('');
    setDescription('');
    setShowMasukModal(false);
    setShowKeluarModal(false);
  };

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    sidebar: { width: '260px', backgroundColor: '#154784', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', position: 'fixed', height: '100vh', zIndex: 10 },
    logoSection: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '12px' },
    menuSectionTitle: { fontSize: '11px', color: '#a0c4eb', marginTop: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '5px' },
    menuItem: { padding: '8px 12px', marginBottom: '2px', borderRadius: '6px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', transition: '0.2s', textDecoration: 'none' },
    activeMenu: { backgroundColor: '#427dfc', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontWeight: '600' },
    divider: { borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' },
    mainContent: { marginLeft: '260px', flex: 1, padding: '40px 50px' },
    dateTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '25px', color: 'black', textAlign: 'left' },
    
    userCard: {
        backgroundColor: '#e6e6e6', padding: '15px 25px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', width: '100%', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    userName: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
    actionContainer: { display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'center' },
    btnMain: (bgColor) => ({
        backgroundColor: bgColor, color: 'white', border: 'none', padding: '15px 0', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '220px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', fontFamily: "'Poppins', sans-serif"
    }),
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalCard: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #ddd' },
    modalTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid black', paddingBottom: '10px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#333' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #aaa', marginBottom: '20px', fontSize: '14px', outline: 'none' },
    modalBtnContainer: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
    btnSave: { backgroundColor: '#154784', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnCancel: { backgroundColor: '#999', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
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
                {/* --- MENU BARU: PREDIKSI STOK --- */}
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Fitur Cerdas</div>
        
        <div style={styles.menuItem} onClick={() => navigate('/prediksi')}>
            <FaChartLine size={14} /> <span>Prediksi Stok</span>
        </div>
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
        
        <div style={{ ...styles.menuItem, ...styles.activeMenu }} onClick={() => navigate('/rekap-kas')}>
            <FaFileAlt size={14} /> <span>Rekap Kas</span>
        </div>
        <div style={{ marginTop: 'auto', cursor: 'pointer', ...styles.menuItem }} onClick={handleLogout}><FaSignOutAlt /> <span>Keluar</span></div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.dateTitle}>{currentDate}</div>

        {/* User Card dengan Navigasi ke Detail Kas */}
        <div style={styles.userCard} onClick={() => navigate('/detail-kas')}>
            <span style={styles.userName}>Bima Aidil</span>
            <FaChevronRight color="#555" />
        </div>

        <div style={styles.actionContainer}>
            <button style={styles.btnMain('#154784')} onClick={() => setShowMasukModal(true)}>Uang Masuk</button>
            <button style={styles.btnMain('#e74c3c')} onClick={() => setShowKeluarModal(true)}>Uang Keluar</button>
        </div>
      </div>

      {/* POPUP UANG MASUK */}
      {showMasukModal && (
        <div style={styles.overlay}>
            <div style={styles.modalCard}>
                <div style={styles.modalTitle}>Uang Masuk</div>
                <label style={styles.label}>Jumlah Uang Masuk</label>
                <input type="number" style={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />
                <label style={styles.label}>Keterangan</label>
                <input type="text" style={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} />
                <div style={styles.modalBtnContainer}>
                    <button style={styles.btnSave} onClick={() => handleSave('Uang Masuk')}>Simpan</button>
                    <button style={styles.btnCancel} onClick={handleCancel}>Batal</button>
                </div>
            </div>
        </div>
      )}

      {/* POPUP UANG KELUAR */}
      {showKeluarModal && (
        <div style={styles.overlay}>
            <div style={styles.modalCard}>
                <div style={styles.modalTitle}>Uang Keluar</div>
                <label style={styles.label}>Jumlah Uang Keluar</label>
                <input type="number" style={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />
                <label style={styles.label}>Keterangan</label>
                <input type="text" style={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} />
                <div style={styles.modalBtnContainer}>
                    <button style={styles.btnSave} onClick={() => handleSave('Uang Keluar')}>Simpan</button>
                    <button style={styles.btnCancel} onClick={handleCancel}>Batal</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RekapKas;