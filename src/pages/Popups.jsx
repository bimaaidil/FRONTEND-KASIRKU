// src/pages/Popups.jsx
import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// --- POPUP SUKSES (Centang Hijau) ---
export const SuccessPopup = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 9999 }}>
      <div className="card border-0 shadow-lg p-4 bg-white rounded-3 w-100 text-center" style={{ maxWidth: '360px', animation: 'fadeIn 0.2s ease-in-out' }}>
        <div className="mb-3 mt-2">
            <FaCheckCircle size={54} color="#7BC143" />
        </div>
        <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>Berhasil!</h4>
        <p className="text-muted small mb-4 px-2" style={{ lineHeight: '1.5' }}>{message}</p>
        <button onClick={onClose} className="btn btn-primary fw-bold w-100 py-2 rounded-3 border-0" style={{ backgroundColor: '#427dfc' }}>
          Konfirmasi Oke
        </button>
      </div>
    </div>
  );
};

// --- POPUP KONFIRMASI HAPUS (Segitiga Kuning) ---
export const ConfirmPopup = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 9999 }}>
      <div className="card border-0 shadow-lg p-4 bg-white rounded-3 w-100 text-center" style={{ maxWidth: '360px', animation: 'fadeIn 0.2s ease-in-out' }}>
        <div className="mb-3 mt-2">
            <FaExclamationTriangle size={54} color="#FFC107" />
        </div>
        <p className="text-dark fw-bold mb-4 px-1" style={{ fontSize: '15px', lineHeight: '1.4' }}>
          {message || "Apakah anda yakin ingin menghapus data karyawan ini?"}
        </p>
        
        <div className="row g-2">
          <div className="col-6">
            <button onClick={onConfirm} className="btn btn-danger w-100 fw-bold py-2 rounded-3 border-0" style={{ backgroundColor: '#E04F4F' }}>
               Ya, Hapus
            </button>
          </div>
          <div className="col-6">
            <button onClick={onClose} className="btn btn-light w-100 fw-bold py-2 rounded-3 border border-secondary-subtle text-secondary">
               Batalkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};