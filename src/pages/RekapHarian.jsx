// src/pages/RekapHarian.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChartLine} from 'react-icons/fa';

const RekapHarian = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [selectedDay, setSelectedDay] = useState(''); // Menyimpan hari yang dipilih
  const [showReport, setShowReport] = useState(false); // Menentukan apakah tabel ditampilkan atau kosong

  // --- DATA DUMMY FULL (SENIN - MINGGU) ---
  const transactionsData = {
    'Senin': [
        { id: 1, date: '17/01/2025', product: 'Jeruk', qty: 2, price: 8000, subtotal: 16000 },
        { id: 2, date: '17/01/2025', product: 'Mangga', qty: 1, price: 8000, subtotal: 8000 },
        { id: 3, date: '17/01/2025', product: 'Vanilla Ice Cream 9', qty: 2, price: 9000, subtotal: 18000 },
        { id: 4, date: '17/01/2025', product: 'Apel Ice Cream', qty: 1, price: 11000, subtotal: 11000 },
    ],
    'Selasa': [
        { id: 1, date: '18/01/2025', product: 'Jambu', qty: 3, price: 8000, subtotal: 24000 },
        { id: 2, date: '18/01/2025', product: 'Cokelat Ice Cream 12', qty: 1, price: 12000, subtotal: 12000 },
        { id: 3, date: '18/01/2025', product: 'Naga', qty: 2, price: 8000, subtotal: 16000 },
    ],
    'Rabu': [
        { id: 1, date: '19/01/2025', product: 'Apel', qty: 2, price: 8000, subtotal: 16000 },
        { id: 2, date: '19/01/2025', product: 'Pokat', qty: 2, price: 8000, subtotal: 16000 },
        { id: 3, date: '19/01/2025', product: 'Timun', qty: 2, price: 8000, subtotal: 16000 },
        { id: 4, date: '19/01/2025', product: 'Nenas', qty: 2, price: 8000, subtotal: 16000 },
        { id: 5, date: '19/01/2025', product: 'Apel', qty: 2, price: 8000, subtotal: 16000 },
        { id: 6, date: '19/01/2025', product: 'Nenas', qty: 2, price: 8000, subtotal: 16000 },
    ],
    'Kamis': [
        { id: 1, date: '20/01/2025', product: 'Mix Ice Cream 15', qty: 1, price: 15000, subtotal: 15000 },
        { id: 2, date: '20/01/2025', product: 'Semangka', qty: 2, price: 8000, subtotal: 16000 },
        { id: 3, date: '20/01/2025', product: 'Melon', qty: 1, price: 8000, subtotal: 8000 },
        { id: 4, date: '20/01/2025', product: 'Jeruk Ice Cream', qty: 2, price: 11000, subtotal: 22000 },
    ],
    'Jumat': [
        { id: 1, date: '21/01/2025', product: 'Strawberry Ice Cream 12', qty: 2, price: 12000, subtotal: 24000 },
        { id: 2, date: '21/01/2025', product: 'Sirsak', qty: 3, price: 8000, subtotal: 24000 },
        { id: 3, date: '21/01/2025', product: 'Terong Belanda', qty: 1, price: 8000, subtotal: 8000 },
        { id: 4, date: '21/01/2025', product: 'Mangga Ice Cream', qty: 2, price: 11000, subtotal: 22000 },
        { id: 5, date: '21/01/2025', product: 'Belimbing', qty: 1, price: 8000, subtotal: 8000 },
    ],
    'Sabtu': [
        { id: 1, date: '22/01/2025', product: 'Mix Ice Cream 15', qty: 3, price: 15000, subtotal: 45000 },
        { id: 2, date: '22/01/2025', product: 'Pokat Ice Cream', qty: 2, price: 11000, subtotal: 22000 },
        { id: 3, date: '22/01/2025', product: 'Naga Ice Cream', qty: 2, price: 11000, subtotal: 22000 },
        { id: 4, date: '22/01/2025', product: 'Vanilla Ice Cream 9', qty: 4, price: 9000, subtotal: 36000 },
        { id: 5, date: '22/01/2025', product: 'Apel', qty: 5, price: 8000, subtotal: 40000 },
    ],
    'Minggu': [
        { id: 1, date: '23/01/2025', product: 'Cokelat Ice Cream 15', qty: 2, price: 15000, subtotal: 30000 },
        { id: 2, date: '23/01/2025', product: 'Strawberry Ice Cream 15', qty: 2, price: 15000, subtotal: 30000 },
        { id: 3, date: '23/01/2025', product: 'Semangka Ice Cream', qty: 3, price: 11000, subtotal: 33000 },
        { id: 4, date: '23/01/2025', product: 'Jagung', qty: 2, price: 8000, subtotal: 16000 },
    ]
  };

  // Ambil data berdasarkan hari yang dipilih (Jika belum klik tampilkan, data kosong)
  const currentData = showReport && selectedDay ? (transactionsData[selectedDay] || []) : [];

  // Hitung Total Pendapatan
  const totalPendapatan = currentData.reduce((acc, curr) => acc + curr.subtotal, 0);

  // --- HANDLER ---
  const handleTampilkan = () => {
    if (selectedDay === '') {
        alert("Silakan pilih hari terlebih dahulu!");
        return;
    }
    setShowReport(true); // Memunculkan data di tabel
  };

  // Reset tabel jika user mengubah dropdown hari
  const handleDayChange = (e) => {
      setSelectedDay(e.target.value);
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
    selectInput: { padding: '8px 15px', borderRadius: '5px', border: '1px solid #777', fontSize: '13px', minWidth: '150px', outline: 'none', color: '#333' },
    disabledInput: { padding: '8px 15px', borderRadius: '5px', border: '1px solid #777', fontSize: '13px', width: '120px', backgroundColor: 'white', color: '#555', outline: 'none' },
    btnTampilkan: { backgroundColor: '#427dfc', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

    // Table
    tableCard: { 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px', 
        backgroundColor: 'white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        minHeight: '200px' // Agar kartu tetap terlihat besar meski kosong
    },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd', fontWeight: 'bold', color: 'black' },
    td: { padding: '12px', borderBottom: '1px solid #eee', color: '#333' },
    
    // Footer Total
    totalSection: { textAlign: 'right', marginTop: '20px', fontSize: '14px', fontWeight: 'bold', color: 'black' }
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
        <div style={{ ...styles.menuItem, ...styles.activeMenu }} onClick={() => navigate('/rekap-harian')}>
            <FaFileAlt size={14} /> <span>Rekap Harian</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-bulanan')}>
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

        <h2 style={styles.pageTitle}>Data Penjualan Harian</h2>

        {/* Filter Section */}
        <div style={styles.filterContainer}>
            <select 
                style={styles.selectInput} 
                value={selectedDay} 
                onChange={handleDayChange}
            >
                <option value="">Pilih nama hari...</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
            </select>
            
            <input type="text" value="Bulan Sekarang" readOnly style={styles.disabledInput} />
            <input type="text" value="2025" readOnly style={{...styles.disabledInput, width: '60px'}} />
            
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
                        <th style={styles.th}>Produk</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Jumlah Beli</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Harga</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Sub Total</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Render Data: Hanya jika showReport = true DAN ada data */}
                    {showReport && currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <tr key={item.id}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{item.date}</td>
                                <td style={styles.td}>{item.product}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{item.qty}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{formatRupiah(item.price)}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{formatRupiah(item.subtotal)}</td>
                            </tr>
                        ))
                    ) : (
                        // Tampilan Kosong (Default)
                        <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#999', height: '100px' }}>
                                {showReport && selectedDay ? "Tidak ada data untuk hari ini." : ""}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Total Footer: Hanya muncul jika ada data */}
            {showReport && currentData.length > 0 && (
                <div style={styles.totalSection}>
                    Total Pendapatan Hari ini: {formatRupiah(totalPendapatan)}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default RekapHarian;