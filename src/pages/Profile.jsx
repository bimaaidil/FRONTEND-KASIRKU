// src/pages/Profile.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();

  // Fungsi Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- STYLES (Disesuaikan dengan UI Target) ---
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'white',
      fontFamily: "'Poppins', sans-serif",
    },
    // --- SIDEBAR (Konsisten dengan Absensi) ---
    sidebar: {
      width: '260px',
      backgroundColor: '#154784', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'fixed',
      height: '100vh',
      zIndex: 10
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '25px', 
      gap: '12px'
    },
    menuSectionTitle: {
      fontSize: '11px', 
      color: '#a0c4eb', 
      marginTop: '12px', 
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      paddingLeft: '5px'
    },
    menuItem: {
      padding: '8px 12px', 
      marginBottom: '2px', 
      borderRadius: '6px',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '13px', 
      transition: '0.2s',
      textDecoration: 'none'
    },
    activeMenu: {
      backgroundColor: '#427dfc', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      fontWeight: '600'
    },
    divider: {
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      margin: '8px 0' 
    },
    
    // --- MAIN CONTENT PROFILE ---
    mainContent: {
      marginLeft: '260px',
      flex: 1,
      padding: '30px 60px',
      backgroundColor: 'white',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: '20px',
      gap: '15px'
    },
    pageTitle: {
      fontSize: '22px',
      fontWeight: '600',
      color: 'black',
      marginBottom: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '40px',
      border: '1px solid #f0f0f0', 
      boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
      display: 'flex',
      gap: '50px',
      position: 'relative'
    },
    formSection: {
      flex: 2, 
    },
    photoSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '30px'
    },
    inputGroup: {
      marginBottom: '18px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '13px',
      color: '#333',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #888',
      fontSize: '14px',
      color: '#333',
      outline: 'none',
    },
    inputDisabled: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #888',
      backgroundColor: '#d6d6d6',
      fontSize: '14px',
      color: '#555',
      outline: 'none',
    },
    rowOne: {
        display: 'flex',
        gap: '30px',
        alignItems: 'flex-start'
    },
    userIconLarge: {
        fontSize: '160px', 
        color: 'black',
        marginBottom: '20px'
    },
    btnChangePhoto: {
        backgroundColor: '#1e5fa8',
        color: 'white',
        border: 'none',
        padding: '8px 25px',
        borderRadius: '5px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    btnSave: {
        position: 'absolute',
        bottom: '40px',
        right: '112px',
        backgroundColor: '#4e89ff',
        color: 'white',
        border: 'none',
        padding: '10px 30px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(78, 137, 255, 0.3)'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* === SIDEBAR === */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <img src={logoImg} alt="Logo" style={{ width: '35px', borderRadius: '5px' }} />
          <h4 className="m-0 fw-bold" style={{ fontSize: '18px' }}>Kasirku</h4>
        </div>
        <div style={styles.divider}></div>
        
        {/* Menu Absensi */}
        <div style={styles.menuItem} onClick={() => navigate('/absensi')}>
          <FaCalendarCheck size={16} /> <span>Absensi</span>
        </div>
        
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Karyawan</div>
        
        {/* === MENU KARYAWAN === */}
        <div style={styles.menuItem} onClick={() => navigate('/kelola-karyawan')}>
            <FaUserFriends size={14} /> <span>Kelola Karyawan</span>
        </div>
        
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Barang</div>
        
        {/* === MENU KELOLA PRODUK (ONCLICK DITAMBAHKAN) === */}
        <div style={styles.menuItem} onClick={() => navigate('/kelola-produk')}>
            <FaBox size={14} /> <span>Kelola Produk</span>
        </div>
        
        {/* Tambahkan onClick */}
        <div style={styles.menuItem} onClick={() => navigate('/transaksi')}>
            <FaExchangeAlt size={14} /> <span>Transaksi</span>
        </div>  
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Laporan</div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-harian')}>
            <FaFileAlt size={14} /> <span>Rekap Harian</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-bulanan')}>
            <FaFileAlt size={14} /> <span>Rekap Bulanan</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-kas')}>
            <FaFileAlt size={14} /> <span>Rekap Kas</span>
        </div>
        <div style={{ marginTop: 'auto', cursor: 'pointer', ...styles.menuItem }} onClick={handleLogout}>
            <FaSignOutAlt /> <span>Keluar</span>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div style={styles.mainContent}>
        
        {/* Header */}
        <div style={styles.header}>
          <span style={{ fontWeight: '600', fontSize: '15px' }}>Bima</span>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span style={{ fontSize: '14px' }}>👤</span>
          </div>
        </div>

        {/* Title */}
        <h2 style={styles.pageTitle}>Profile</h2>

        {/* CARD PROFILE */}
        <div style={styles.card}>
            
            {/* --- Bagian Kiri: Form --- */}
            <div style={styles.formSection}>
                
                <div style={styles.rowOne}>
                    <div style={{ width: '250px' }}> 
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nama</label>
                            <input type="text" style={styles.input} defaultValue="Bima Aidil" />
                        </div>
                    </div>
                    <div style={{ width: '200px' }}> 
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Jabatan/Posisi</label>
                            <input type="text" style={styles.inputDisabled} defaultValue="-" disabled />
                        </div>
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input type="text" style={styles.input} defaultValue="bimaaidil" />
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password Baru</label>
                        <input type="password" style={styles.input} placeholder="" />
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Alamat</label>
                        <input type="text" style={styles.input} defaultValue="Jl.Hangtuah Ujung" />
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>No Telepon</label>
                        <input type="text" style={styles.input} defaultValue="082231936754" />
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input type="email" style={styles.input} defaultValue="bima@gmail.com" />
                    </div>
                </div>

            </div>

            {/* --- Bagian Kanan: Foto --- */}
            <div style={styles.photoSection}>
                <FaUserCircle style={styles.userIconLarge} />
                <button style={styles.btnChangePhoto}>Ubah Foto</button>
            </div>

            {/* Tombol Simpan */}
            <button style={styles.btnSave}>Simpan Perubahan</button>

        </div>

      </div>
    </div>
  );
};

export default Profile;