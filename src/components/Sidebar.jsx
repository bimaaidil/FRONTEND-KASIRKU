// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
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
  FaClipboardCheck,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  // --- STATE DETEKSI LAYAR & TOGGLE HP ---
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false); // Reset status buka di PC
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false); // Otomatis tutup sidebar di HP setelah menu diklik
  };

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

  // --- STYLES CONFIGURATION ---
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
      zIndex: 1050, // Z-index tinggi agar melayang di atas konten tabel
      top: 0,
      left: isMobile ? (isOpen ? '0' : '-260px') : '0', // Geser keluar layar jika ditutup di HP
      transition: 'all 0.3s ease-in-out',
      overflowY: 'auto', 
      scrollbarWidth: 'thin',  
      msOverflowStyle: 'none', 
      boxShadow: isMobile && isOpen ? '5px 0 25px rgba(0,0,0,0.3)' : 'none'
    },
    logoSection: { 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '25px', 
      gap: '12px',
      paddingTop: isMobile ? '50px' : '0' // Beri ruang di HP agar tidak tertutup tombol silang
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
      padding: '10px 12px', 
      marginBottom: '4px', 
      borderRadius: '6px', 
      cursor: 'pointer', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      fontSize: '13px', 
      transition: '0.2s',
      flexShrink: 0 
    },
    activeMenu: { 
      backgroundColor: '#427dfc', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)', 
      fontWeight: '600' 
    },
    divider: { borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '10px 0', flexShrink: 0 },
    userInfo: {
      marginTop: '30px', 
      padding: '10px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '8px',
      marginBottom: '10px',
      flexShrink: 0
    },
    logoutItem: {
      padding: '10px 12px', 
      marginBottom: '20px', 
      borderRadius: '6px', 
      cursor: 'pointer', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      fontSize: '13px', 
      transition: '0.3s',
      flexShrink: 0
    },
    // Tombol pemicu hamburger melayang di HP
    toggleBtn: {
      position: 'fixed',
      top: '15px',
      left: '15px',
      width: '42px',
      height: '42px',
      backgroundColor: '#154784',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
    },
    // Latar belakang gelap transparan saat menu terbuka di HP
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 1040,
      transition: '0.3s ease'
    }
  };

  return (
    <>
      {/* TOMBOL TOGGLE HAMBURGER (Hanya Render di HP) */}
      {isMobile && (
        <button style={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
        </button>
      )}

      {/* BACKGROUND OVERLAY (Hanya Aktif di HP Saat Menu Terbuka) */}
      {isMobile && isOpen && (
        <div style={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      {/* SIDEBAR CONTAINER CONTAINER */}
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
          onClick={() => handleNavigation('/absensi')}
        >
          <FaCalendarCheck size={16} /> <span>Absensi</span>
        </div>

        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Fitur Cerdas</div>
        <div 
          style={isActive('/prediksi') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
          onClick={() => handleNavigation('/prediksi')}
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
              onClick={() => handleNavigation('/kelola-karyawan')}
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
          onClick={() => handleNavigation('/kelola-produk')}
        >
          <FaBox size={14} /> <span>Kelola Produk</span>
        </div>

        {/* MENU STOK OPNAME */}
        <div 
          style={isActive('/stok-opname') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
          onClick={() => handleNavigation('/stok-opname')}
        >
          <FaClipboardCheck size={14} /> <span>Stok Opname</span>
        </div>

        <div 
          style={isActive('/transaksi') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem}
          onClick={() => handleNavigation('/transaksi')}
        >
          <FaExchangeAlt size={14} /> <span>Transaksi</span>
        </div>

        {/* MENU LAPORAN */}
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Laporan</div>
        
        <div 
          style={isActive('/rekap-harian') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem} 
          onClick={() => handleNavigation('/rekap-harian')}
        >
          <FaFileAlt size={14} /> <span>Rekap Harian</span>
        </div>

        <div 
          style={isActive('/rekap-bulanan') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem} 
          onClick={() => handleNavigation('/rekap-bulanan')}
        >
          <FaFileAlt size={14} /> <span>Rekap Bulanan</span>
        </div>

        <div 
          style={isActive('/rekap-kas') ? {...styles.menuItem, ...styles.activeMenu} : styles.menuItem} 
          onClick={() => handleNavigation('/rekap-kas')}
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
    </>
  );
};

export default Sidebar;