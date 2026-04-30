// src/pages/Profile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // <--- IMPORT SIDEBAR TUNGGAL
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();

  // Ambil data user dari localStorage agar profil dinamis
  const userName = localStorage.getItem('userName') || 'Pengguna';
  const userRole = localStorage.getItem('userRole') || '-';
  const userEmail = localStorage.getItem('userEmail') || '-';

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 60px', backgroundColor: 'white', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px', gap: '15px' },
    pageTitle: { fontSize: '22px', fontWeight: '600', color: 'black', marginBottom: '20px' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '40px', border: '1px solid #f0f0f0', boxShadow: '0 4px 25px rgba(0,0,0,0.03)', display: 'flex', gap: '50px', position: 'relative' },
    formSection: { flex: 2 },
    photoSection: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '30px' },
    inputGroup: { marginBottom: '18px' },
    label: { display: 'block', marginBottom: '6px', fontSize: '13px', color: '#333', fontWeight: '500' },
    input: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #888', fontSize: '14px', color: '#333', outline: 'none' },
    inputDisabled: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #888', backgroundColor: '#d6d6d6', fontSize: '14px', color: '#555', outline: 'none' },
    rowOne: { display: 'flex', gap: '30px', alignItems: 'flex-start' },
    userIconLarge: { fontSize: '160px', color: 'black', marginBottom: '20px' },
    btnChangePhoto: { backgroundColor: '#1e5fa8', color: 'white', border: 'none', padding: '8px 25px', borderRadius: '5px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
    btnSave: { position: 'absolute', bottom: '40px', right: '112px', backgroundColor: '#4e89ff', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 10px rgba(78, 137, 255, 0.3)' }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. PANGGIL SIDEBAR TUNGGAL */}
      <Sidebar />

      {/* === MAIN CONTENT === */}
      <div style={styles.mainContent}>
        
        {/* Header Pojok Kanan */}
        <div style={styles.header}>
          <span style={{ fontWeight: '600', fontSize: '15px' }}>{userName}</span>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span style={{ fontSize: '14px' }}>👤</span>
          </div>
        </div>

        <h2 style={styles.pageTitle}>Profil Saya</h2>

        {/* CARD PROFILE */}
        <div style={styles.card}>
            
            {/* --- Bagian Kiri: Form --- */}
            <div style={styles.formSection}>
                
                <div style={styles.rowOne}>
                    <div style={{ width: '250px' }}> 
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nama Lengkap</label>
                            <input type="text" style={styles.inputDisabled} value={userName} disabled />
                        </div>
                    </div>
                    <div style={{ width: '200px' }}> 
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Jabatan/Posisi</label>
                            <input type="text" style={styles.inputDisabled} value={userRole} disabled />
                        </div>
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Terdaftar</label>
                        <input type="email" style={styles.inputDisabled} value={userEmail} disabled />
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password Baru (Opsional)</label>
                        <input type="password" style={styles.input} placeholder="Masukkan password baru..." />
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>No Telepon</label>
                        <input type="text" style={styles.input} defaultValue="08223193XXXX" />
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Alamat</label>
                        <input type="text" style={styles.input} defaultValue="Pekanbaru, Riau" />
                    </div>
                </div>

            </div>

            {/* --- Bagian Kanan: Foto --- */}
            <div style={styles.photoSection}>
                <FaUserCircle style={styles.userIconLarge} />
                <button style={styles.btnChangePhoto}>Ubah Foto</button>
            </div>

            {/* Tombol Simpan */}
            <button style={styles.btnSave} onClick={() => alert("Perubahan disimpan!")}>
                Simpan Perubahan
            </button>

        </div>
      </div>
    </div>
  );
};

export default Profile;