// src/pages/Profile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import { FaUserCircle, FaArrowLeft } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Pengguna';
  const userRole = localStorage.getItem('userRole') || '-';
  const userEmail = localStorage.getItem('userEmail') || '-';

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        
        {/* HEADER */}
        <div className="d-flex justify-content-end align-items-center gap-2.5 mb-4 bg-white p-3 rounded-3 shadow-sm d-md-flex">
          <span className="fw-semibold small text-dark">{userName}</span>
          <FaUserCircle style={{ fontSize: '32px', color: '#154784' }} />
        </div>

        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px' }}>Profil Saya</h2>

        <div className="card border-0 shadow-sm p-4 rounded-3 bg-white position-relative">
          {/* Menggunakan Susunan Flex Row-Reverse agar Foto Profil naik ke atas Form saat di layar HP */}
          <div className="d-flex flex-column flex-md-row-reverse gap-4 gap-md-5 mb-5">
            
            {/* SEKSI FOTO PROFIL */}
            <div className="d-flex flex-column align-items-center justify-content-center text-center p-3" style={{ flex: 1 }}>
                <FaUserCircle className="text-secondary mb-3" style={{ fontSize: window.innerWidth > 576 ? '150px' : '110px' }} />
                <button className="btn btn-primary btn-sm fw-medium px-4 py-2 rounded-pill" style={{ backgroundColor: '#1e5fa8', border: 'none' }}>Ubah Foto</button>
            </div>

            {/* SEKSI INPUT FORM DATA */}
            <div style={{ flex: 2 }}>
              <div className="row g-3">
                <div className="col-12 col-sm-7">
                  <label className="form-label fw-medium text-secondary small mb-1">Nama Lengkap</label>
                  <input type="text" className="form-control py-2.5" style={{ backgroundColor: '#e9ecef', color: '#495057' }} value={userName} disabled />
                </div>
                <div className="col-12 col-sm-5">
                  <label className="form-label fw-medium text-secondary small mb-1">Jabatan/Posisi</label>
                  <input type="text" className="form-control py-2.5" style={{ backgroundColor: '#e9ecef', color: '#495057' }} value={userRole} disabled />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium text-secondary small mb-1">Email Terdaftar</label>
                  <input type="email" className="form-control py-2.5" style={{ backgroundColor: '#e9ecef', color: '#495057' }} value={userEmail} disabled />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium text-dark small mb-1">Password Baru (Opsional)</label>
                  <input type="password" className="form-control bg-light py-2.5" placeholder="Masukkan password baru..." />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium text-dark small mb-1">No Telepon</label>
                  <input type="text" className="form-control bg-light py-2.5" defaultValue="08223193XXXX" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium text-dark small mb-1">Alamat</label>
                  <input type="text" className="form-control bg-light py-2.5" defaultValue="Pekanbaru, Riau" />
                </div>
              </div>
            </div>

          </div>

          {/* TOMBOL SIMPAN UTAMA */}
          <div className="d-flex justify-content-end border-top pt-4">
            <button className="btn btn-primary fw-bold px-5 py-2.5 rounded-3 w-100 w-sm-auto shadow-sm" style={{ backgroundColor: '#4e89ff', border: 'none' }} onClick={() => alert("Perubahan disimpan!")}>
                Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;