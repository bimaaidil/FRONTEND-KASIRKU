// src/pages/RekapKas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // <--- IMPORT SIDEBAR TUNGGAL
import { FaChevronRight } from 'react-icons/fa';

const RekapKas = () => {
  const navigate = useNavigate();

  // Ambil Nama User untuk tampilan kartu
  const userName = localStorage.getItem('userName') || 'Karyawan';

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

  // --- LOGIKA SIMPAN KE LOCALSTORAGE ---
  const handleSave = (type) => {
    if (!amount || !description) {
        alert("Mohon lengkapi semua data!");
        return;
    }

    const existingData = JSON.parse(localStorage.getItem('kasData')) || [];

    const newTransaction = {
        id: Date.now(),
        type: type, 
        amount: parseInt(amount),
        description: description,
        date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        user: userName 
    };

    localStorage.setItem('kasData', JSON.stringify([newTransaction, ...existingData]));

    alert(`Berhasil menyimpan ${type}`);
    
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
    mainContent: { marginLeft: '260px', flex: 1, padding: '40px 50px' },
    dateTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937', textAlign: 'left' },
    
    userCard: {
        backgroundColor: '#f3f4f6', padding: '20px 25px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', width: '100%', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: '0.2s'
    },
    userNameStyle: { fontSize: '16px', fontWeight: 'bold', color: '#374151' },
    actionContainer: { display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center' },
    btnMain: (bgColor) => ({
        backgroundColor: bgColor, color: 'white', border: 'none', padding: '18px 0', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '240px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: "'Poppins', sans-serif", transition: '0.3s'
    }),
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalCard: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
    modalTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '2px solid #154784', paddingBottom: '12px', color: '#111827' },
    label: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#4b5563' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '20px', fontSize: '14px', outline: 'none' },
    modalBtnContainer: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
    btnSave: { backgroundColor: '#154784', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    btnCancel: { backgroundColor: '#9ca3af', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      {/* 1. PANGGIL SIDEBAR TUNGGAL */}
      <Sidebar />

      {/* 2. MAIN CONTENT */}
      <div style={styles.mainContent}>
        <div style={styles.dateTitle}>{currentDate}</div>

        {/* User Card dengan Navigasi ke Detail Kas */}
        <div 
            style={styles.userCard} 
            onClick={() => navigate('/detail-kas')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
            <span style={styles.userNameStyle}>{userName}</span>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <span style={{fontSize:'12px', color:'#6b7280'}}>Lihat Detail</span>
                <FaChevronRight color="#9ca3af" />
            </div>
        </div>

        <div style={styles.actionContainer}>
            <button 
                style={styles.btnMain('#154784')} 
                onClick={() => setShowMasukModal(true)}
            >
                Uang Masuk
            </button>
            <button 
                style={styles.btnMain('#dc2626')} 
                onClick={() => setShowKeluarModal(true)}
            >
                Uang Keluar
            </button>
        </div>
      </div>

      {/* POPUP UANG MASUK */}
      {showMasukModal && (
        <div style={styles.overlay}>
            <div style={styles.modalCard}>
                <div style={styles.modalTitle}>Input Uang Masuk</div>
                <label style={styles.label}>Jumlah (Rp)</label>
                <input type="number" placeholder="Contoh: 50000" style={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />
                <label style={styles.label}>Keterangan</label>
                <input type="text" placeholder="Contoh: Modal awal" style={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} />
                <div style={styles.modalBtnContainer}>
                    <button style={styles.btnCancel} onClick={handleCancel}>Batal</button>
                    <button style={styles.btnSave} onClick={() => handleSave('Uang Masuk')}>Simpan Data</button>
                </div>
            </div>
        </div>
      )}

      {/* POPUP UANG KELUAR */}
      {showKeluarModal && (
        <div style={styles.overlay}>
            <div style={styles.modalCard}>
                <div style={styles.modalTitle}>Input Uang Keluar</div>
                <label style={styles.label}>Jumlah (Rp)</label>
                <input type="number" placeholder="Contoh: 15000" style={styles.input} value={amount} onChange={(e) => setAmount(e.target.value)} />
                <label style={styles.label}>Keterangan</label>
                <input type="text" placeholder="Contoh: Beli Es Batu" style={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} />
                <div style={styles.modalBtnContainer}>
                    <button style={styles.btnCancel} onClick={handleCancel}>Batal</button>
                    <button style={{...styles.btnSave, backgroundColor: '#dc2626'}} onClick={() => handleSave('Uang Keluar')}>Simpan Data</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RekapKas;