import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 

// Import Icons
import { 
  FaUserFriends, 
  FaBox, 
  FaExchangeAlt, 
  FaFileAlt, 
  FaSignOutAlt, 
  FaCalendarCheck, 
  FaChartLine,
  FaClipboardCheck 
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      try {
        await signOut(auth);
        localStorage.clear(); 
        navigate('/');
      } catch (error) {
        alert("Gagal logout!");
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  const styles = {
    sidebar: { 
      width: '260px', 
      backgroundColor: '#154784', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '20px', 
      position: 'fixed', 
      height: '100vh', 
      zIndex: 10,
      // --- LOGIKA SCROLL TAMBAHAN ---
      overflowY: 'auto',       // Mengaktifkan scroll vertikal
      scrollbarWidth: 'thin',  // Untuk Firefox agar lebih rapi
      msOverflowStyle: 'none', // Untuk Internet Explorer/Edge
    },
    logoSection: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '12px' },
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
      padding: '10px 12px', 
      marginBottom: '4px', 
      borderRadius: '6px', 
      cursor: 'pointer', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      fontSize: '13px', 
      transition: '0.3s',
      flexShrink: 0 // Mencegah item menu mengecil saat container penuh
    },
    activeMenu: { 
      backgroundColor: '#427dfc', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)', 
      fontWeight: '600' 
    },
    divider: { borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '10px 0', flexShrink: 0 },
    userInfo: {
      marginTop: '30px', // Memberi jarak dari menu atas
      padding: '10px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '8px',
      marginBottom: '10px',
      flexShrink: 0
    },
    logoutItem: {
      padding: '10px 12px', 
      marginBottom: '20px', // Jarak aman paling bawah
      borderRadius: '6px', 
      cursor: 'pointer', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      fontSize: '13px', 
      transition: '0.3s',
      flexShrink: 0
    }
  };

  return (
    <div style={styles.sidebar} className="sidebar-container">
      {/* HEADER LOGO */}
      <div style={styles.logoSection}>
        <img src={logoImg} alt="Logo" style={{ width: '35px', borderRadius: '5px' }} />
        <h4 className="m-0 fw-bold" style={{ fontSize: '18px' }}>Kasirku</h4>
      </div>
      
      <div style={styles.divider}></div>

      {/* MENU UTAMA */}
      <div 
        style={isActive('/absensi') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
        onClick={() => navigate('/absensi')}
      >
        <FaCalendarCheck size={16} /> <span>Absensi</span>
      </div>

      <div style={styles.divider}></div>
      <div style={styles.menuSectionTitle}>Fitur Cerdas</div>
      <div 
        style={isActive('/prediksi') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
        onClick={() => navigate('/prediksi')}
      >
        <FaChartLine size={14} /> <span>Prediksi Stok</span>
      </div>

      {/* KHUSUS ADMIN */}
      {userRole === 'Admin' && (
        <>
          <div style={styles.divider}></div>
          <div style={styles.menuSectionTitle}>Karyawan</div>
          <div 
            style={isActive('/kelola-karyawan') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
            onClick={() => navigate('/kelola-karyawan')}
          >
            <FaUserFriends size={14} /> <span>Kelola Karyawan</span>
          </div>
        </>
      )}

      {/* MENU BARANG */}
      <div style={styles.divider}></div>
      <div style={styles.menuSectionTitle}>Barang</div>
      <div 
        style={isActive('/kelola-produk') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
        onClick={() => navigate('/kelola-produk')}
      >
        <FaBox size={14} /> <span>Kelola Produk</span>
      </div>

      {/* MENU STOK OPNAME */}
      <div 
        style={isActive('/stok-opname') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
        onClick={() => navigate('/stok-opname')}
      >
        <FaClipboardCheck size={14} /> <span>Stok Opname</span>
      </div>

      <div 
        style={isActive('/transaksi') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
        onClick={() => navigate('/transaksi')}
      >
        <FaExchangeAlt size={14} /> <span>Transaksi</span>
      </div>

      {/* MENU LAPORAN */}
      <div style={styles.divider}></div>
      <div style={styles.menuSectionTitle}>Laporan</div>
      
      <div 
        style={isActive('/rekap-harian') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem} 
        onClick={() => navigate('/rekap-harian')}
      >
        <FaFileAlt size={14} /> <span>Rekap Harian</span>
      </div>

      <div 
        style={isActive('/rekap-bulanan') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem} 
        onClick={() => navigate('/rekap-bulanan')}
      >
        <FaFileAlt size={14} /> <span>Rekap Bulanan</span>
      </div>

      <div 
        style={isActive('/rekap-kas') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem} 
        onClick={() => navigate('/rekap-kas')}
      >
        <FaFileAlt size={14} /> <span>Rekap Kas</span>
      </div>

      {/* INFO USER & TOMBOL KELUAR */}
      <div style={styles.userInfo}>
        <div style={{ fontSize: '12px', fontWeight: '600' }}>{userName || 'User'}</div>
        <div style={{ fontSize: '10px', color: '#a0c4eb' }}>{userRole}</div>
      </div>

      <div style={styles.logoutItem} onClick={handleLogout}>
        <FaSignOutAlt /> <span>Keluar</span>
      </div>
    </div>
  );
};

export default Sidebar;