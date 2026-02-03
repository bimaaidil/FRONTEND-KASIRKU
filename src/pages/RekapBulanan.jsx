// src/pages/RekapBulanan.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChevronLeft, FaChevronRight, FaChartLine } from 'react-icons/fa';

const RekapBulanan = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showReport, setShowReport] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Menampilkan 6 baris per halaman

  // --- DATA DUMMY ---
  const monthlyData = [
    { id: 1, date: '19/01/2025', product: 'Apel', qty: 2, price: 8000, subtotal: 16000 },
    { id: 2, date: '19/01/2025', product: 'Naga', qty: 2, price: 8000, subtotal: 16000 },
    { id: 3, date: '19/01/2025', product: 'Timun', qty: 2, price: 8000, subtotal: 16000 },
    { id: 4, date: '19/01/2025', product: 'Nenas', qty: 2, price: 8000, subtotal: 16000 },
    { id: 5, date: '19/01/2025', product: 'Pokat', qty: 2, price: 8000, subtotal: 16000 },
    { id: 6, date: '19/01/2025', product: 'Belimbing', qty: 2, price: 8000, subtotal: 16000 },
    // Data Halaman 2
    { id: 7, date: '20/01/2025', product: 'Vanilla Ice Cream 9', qty: 1, price: 9000, subtotal: 9000 },
    { id: 8, date: '20/01/2025', product: 'Cokelat Ice Cream 12', qty: 1, price: 12000, subtotal: 12000 },
    { id: 9, date: '20/01/2025', product: 'Mix Ice Cream 15', qty: 1, price: 15000, subtotal: 15000 },
    { id: 10, date: '21/01/2025', product: 'Jeruk', qty: 3, price: 8000, subtotal: 24000 },
    { id: 11, date: '21/01/2025', product: 'Mangga', qty: 2, price: 8000, subtotal: 16000 },
    { id: 12, date: '21/01/2025', product: 'Sirsak', qty: 2, price: 8000, subtotal: 16000 },
    // Data dummy tambahan
    { id: 13, date: '22/01/2025', product: 'Apel', qty: 5, price: 8000, subtotal: 40000 },
  ];

  // Logic Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = showReport ? monthlyData.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(monthlyData.length / itemsPerPage);

  // Hitung Total Pendapatan Bulan Ini
  const totalPendapatan = monthlyData.reduce((acc, curr) => acc + curr.subtotal, 0);

  // --- HANDLER ---
  const handleTampilkan = () => {
    if (selectedMonth === '') {
        alert("Silakan pilih bulan terlebih dahulu!");
        return;
    }
    setShowReport(true);
    setCurrentPage(1); 
  };

  const handleMonthChange = (e) => {
      setSelectedMonth(e.target.value);
      setShowReport(false); 
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(num);

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    sidebar: { width: '260px', backgroundColor: '#154784', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', position: 'fixed', height: '100vh', zIndex: 10 },
    logoSection: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '12px' },
    menuSectionTitle: { fontSize: '11px', color: '#a0c4eb', marginTop: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '5px' },
    menuItem: { padding: '8px 12px', marginBottom: '2px', borderRadius: '6px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', transition: '0.2s', textDecoration: 'none' },
    activeMenu: { backgroundColor: '#427dfc', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontWeight: '600' },
    divider: { borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' },
    
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 50px' },
    headerUser: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' },
    userProfile: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' },
    userIcon: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    pageTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: 'black' },
    
    // Filter
    filterContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
    selectInput: { padding: '8px 15px', borderRadius: '5px', border: '1px solid #777', fontSize: '13px', minWidth: '180px', outline: 'none', color: '#333' },
    disabledInput: { padding: '8px 15px', borderRadius: '5px', border: '1px solid #777', fontSize: '13px', width: '80px', backgroundColor: 'white', color: '#555', outline: 'none', textAlign: 'center' },
    btnTampilkan: { backgroundColor: '#427dfc', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

    // Table Container
    tableCard: { 
        border: '2px solid #427dfc', 
        borderRadius: '10px', 
        padding: '20px', 
        backgroundColor: 'white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        minHeight: '400px', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between' 
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd', fontWeight: 'bold', color: 'black' },
    td: { padding: '12px', borderBottom: '1px solid #eee', color: '#333' },
    
    // Total Pendapatan
    totalSection: { textAlign: 'right', marginTop: '20px', fontSize: '14px', fontWeight: 'bold', color: 'black' },

    // Pagination
    paginationContainer: { display: 'flex', alignItems: 'center', gap: '5px', marginTop: '20px' },
    pageBtn: (isActive) => ({
        width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
        backgroundColor: isActive ? '#154784' : 'white',
        color: isActive ? 'white' : '#333'
    }),
    arrowBtn: { width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#eee', color: '#555' }
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
        
        {/* Menu Aktif: Rekap Bulanan */}
        <div style={{ ...styles.menuItem, ...styles.activeMenu }} onClick={() => navigate('/rekap-bulanan')}>
            <FaFileAlt size={14} /> <span>Rekap Bulanan</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-kas')}>
            <FaFileAlt size={14} /> <span>Rekap Kas</span>
        </div>
        <div style={{ marginTop: 'auto', cursor: 'pointer', ...styles.menuItem }} onClick={handleLogout}><FaSignOutAlt /> <span>Keluar</span></div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        
        {/* Header Kanan */}
        <div style={styles.headerUser}>
            <div style={styles.userProfile}>
                <span>Bima</span>
                <div style={styles.userIcon}>👤</div>
            </div>
        </div>

        <h2 style={styles.pageTitle}>Data Penjualan Bulanan</h2>

        {/* Filter Section */}
        <div style={styles.filterContainer}>
            <select style={styles.selectInput} value={selectedMonth} onChange={handleMonthChange}>
                <option value="">Pilih nama bulan...</option>
                <option value="Januari">Januari</option>
                <option value="Februari">Februari</option>
                <option value="Maret">Maret</option>
                <option value="April">April</option>
                <option value="Mei">Mei</option>
                <option value="Juni">Juni</option>
                <option value="Juli">Juli</option>
                <option value="Agustus">Agustus</option>
                <option value="September">September</option>
                <option value="Oktober">Oktober</option>
                <option value="November">November</option>
                <option value="Desember">Desember</option>
            </select>
            
            <input type="text" value="2025" readOnly style={styles.disabledInput} />
            
            <button style={styles.btnTampilkan} onClick={handleTampilkan}>
                Tampilkan Laporan
            </button>
        </div>

        {/* Table Section */}
        <div style={styles.tableCard}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>No</th>
                        <th style={styles.th}>Tanggal Transaksi</th>
                        {/* HAPUS KOLOM NAMA CUSTOMER */}
                        <th style={styles.th}>Produk</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Jumlah Beli</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Harga</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Sub Total</th>
                    </tr>
                </thead>
                <tbody>
                    {showReport && currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <tr key={item.id}>
                                <td style={styles.td}>{indexOfFirstItem + index + 1}</td>
                                <td style={styles.td}>{item.date}</td>
                                {/* HAPUS DATA NAMA CUSTOMER */}
                                <td style={styles.td}>{item.product}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{item.qty}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{formatRupiah(item.price)}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{formatRupiah(item.subtotal)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#999', height: '100px' }}>
                                {showReport && selectedMonth ? "Tidak ada data untuk bulan ini." : ""}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Footer Total & Pagination */}
            {showReport && currentItems.length > 0 && (
                <div>
                    <div style={styles.totalSection}>
                        Total Pendapatan Bulan ini: {formatRupiah(totalPendapatan)}
                    </div>

                    <div style={styles.paginationContainer}>
                        <button style={styles.arrowBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            <FaChevronLeft size={10} />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button 
                                key={i + 1} 
                                style={styles.pageBtn(currentPage === i + 1)}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        
                        {totalPages > 3 && <span style={{fontSize:'12px', color:'#555'}}>... 15</span>}

                        <button style={styles.arrowBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                            <FaChevronRight size={10} />
                        </button>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default RekapBulanan;