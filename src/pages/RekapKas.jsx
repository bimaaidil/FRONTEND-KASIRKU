// src/pages/RekapKas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaChevronRight, FaTimes } from 'react-icons/fa';

// --- IMPORT API KAS CLOUD ---
import { saveKasLog } from '../services/kas_api';

const RekapKas = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Karyawan';

  const [currentDate, setCurrentDate] = useState('');
  const [showMasukModal, setShowMasukModal] = useState(false);
  const [showKeluarModal, setShowKeluarModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    setCurrentDate(date.toLocaleDateString('id-ID', options));
  }, []);

  const handleSave = async (type) => {
    if (!amount || !description) {
        alert("Mohon lengkapi semua data!");
        return;
    }

    setIsSaving(true);
    const newTransaction = {
        id: Date.now(),
        type: type, 
        amount: parseInt(amount),
        description: description,
        date: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        user: userName 
    };

    try {
        // Simpan langsung ke Cloud Firestore via Flask API
        await saveKasLog(newTransaction);
        alert(`Berhasil menyimpan ${type} ke cloud database!`);
        
        setAmount('');
        setDescription('');
        setShowMasukModal(false);
        setShowKeluarModal(false);
    } catch (error) {
        alert("Gagal menyimpan data ke server cloud, silakan coba lagi.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setAmount('');
    setDescription('');
    setShowMasukModal(false);
    setShowKeluarModal(false);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        <div className="fw-semibold text-secondary mb-3" style={{ fontSize: '15px' }}>{currentDate}</div>

        {/* User Navigation Card */}
        <div 
            className="card border-0 shadow-sm p-3 px-4 rounded-3 bg-white d-flex flex-row justify-content-between align-items-center mb-5"
            style={{ cursor: 'pointer', transition: '0.2s' }}
            onClick={() => navigate('/detail-kas')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eef2f7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
        >
            <span className="fw-bold text-dark" style={{ fontSize: '16px' }}>{userName}</span>
            <div className="d-flex align-items-center gap-2">
                <span className="text-muted" style={{ fontSize: '12px' }}>Lihat Detail</span>
                <FaChevronRight className="text-muted" size={12} />
            </div>
        </div>

        {/* BUTTON ACTION RESPONSIVE GRIDS */}
        <div className="row g-3 justify-content-center">
            <div className="col-12 col-sm-6 d-flex justify-content-center justify-content-sm-end">
                <button className="btn btn-primary text-white fw-bold py-3 w-100 rounded-3 shadow-sm" style={{ maxWidth: '250px', backgroundColor: '#154784', border: 'none' }} onClick={() => setShowMasukModal(true)}>
                    Uang Masuk
                </button>
            </div>
            <div className="col-12 col-sm-6 d-flex justify-content-center justify-content-sm-start">
                <button className="btn btn-danger text-white fw-bold py-3 w-100 rounded-3 shadow-sm" style={{ maxWidth: '250px' }} onClick={() => setShowKeluarModal(true)}>
                    Uang Keluar
                </button>
            </div>
        </div>
      </div>

      {/* MODAL OVERLAYS RESPONSIVE POPUP */}
      {(showMasukModal || showKeluarModal) && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}>
            <div className="card border-0 shadow-lg p-4 bg-white rounded-3 w-100" style={{ maxWidth: '440px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderColor: '#154784' }}>
                    <h5 className="fw-bold text-dark m-0">{showMasukModal ? 'Input Uang Masuk' : 'Input Uang Keluar'}</h5>
                    <button className="btn btn-link text-muted p-0" onClick={handleCancel} disabled={isSaving}><FaTimes /></button>
                </div>
                
                <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">Jumlah (Rp)</label>
                    <input type="number" placeholder="Contoh: 50000" className="form-control bg-light py-2" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isSaving} required />
                </div>
                
                <div className="mb-4">
                    <label className="form-label fw-semibold text-secondary small">Keterangan</label>
                    <input type="text" placeholder={showMasukModal ? "Contoh: Modal awal" : "Contoh: Beli Es Batu"} className="form-control bg-light py-2" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isSaving} required />
                </div>
                
                <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary px-4 fw-semibold" onClick={handleCancel} disabled={isSaving}>Batal</button>
                    <button 
                      className="btn text-white px-4 fw-bold d-flex align-items-center gap-2" 
                      style={{ backgroundColor: showMasukModal ? '#154784' : '#dc2626', border: 'none' }} 
                      onClick={() => handleSave(showMasukModal ? 'Uang Masuk' : 'Uang Keluar')}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RekapKas;