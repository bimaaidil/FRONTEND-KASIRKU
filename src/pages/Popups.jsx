// src/pages/Popups.jsx
import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// --- POPUP SUKSES (Centang Hijau) ---
export const SuccessPopup = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.box}>
        <div style={{ marginBottom: '15px' }}>
            <FaCheckCircle size={50} color="#7BC143" /> {/* Ikon Centang Hijau */}
        </div>
        <h3 style={popupStyles.title}>Berhasil!</h3>
        <p style={popupStyles.message}>{message}</p>
        <button onClick={onClose} style={popupStyles.btnConfirmBlue}>
          Konfirmasi
        </button>
      </div>
    </div>
  );
};

// --- POPUP KONFIRMASI HAPUS (Segitiga Kuning) ---
export const ConfirmPopup = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.box}>
        <div style={{ marginBottom: '15px' }}>
            <FaExclamationTriangle size={50} color="#FFC107" /> {/* Ikon Peringatan Kuning */}
        </div>
        <p style={{ ...popupStyles.message, fontWeight: 'bold', fontSize: '16px' }}>
          {message || "Apakah anda yakin ingin menghapus data karyawan ini?"}
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={onConfirm} style={popupStyles.btnDanger}>
             Hapus
          </button>
          <button onClick={onClose} style={popupStyles.btnCancel}>
             Batal
          </button>
        </div>
      </div>
    </div>
  );
};

// --- STYLE ---
const popupStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
  },
  box: {
    backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '350px', textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)', animation: 'fadeIn 0.2s ease-in-out'
  },
  title: { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' },
  message: { fontSize: '14px', color: '#555', marginBottom: '20px' },
  btnConfirmBlue: {
    backgroundColor: '#427dfc', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
  },
  btnDanger: {
    backgroundColor: '#E04F4F', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
  },
  btnCancel: {
    backgroundColor: '#427dfc', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
  }
};