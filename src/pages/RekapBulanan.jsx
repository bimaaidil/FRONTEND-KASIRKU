// src/pages/RekapBulanan.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RekapBulanan = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  // --- STATE ---
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [dataBulanan, setDataBulanan] = useState([]); // State untuk menampung hasil filter
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // --- HANDLER TAMPILKAN ---
  const handleTampilkan = () => {
    if (selectedMonth === '') {
        alert("Silakan pilih bulan terlebih dahulu!");
        return;
    }

    // 1. Ambil semua riwayat transaksi dari localStorage
    const allHistory = JSON.parse(localStorage.getItem('historyTransaksi')) || [];

    // 2. Filter data berdasarkan bulan (mencocokkan kolom 'date' atau 'month')
    // Kita filter dengan mengecek apakah string tanggal mengandung nama bulan atau menggunakan objek Date
    const filtered = allHistory.filter(item => {
        // Asumsi di Transaksi.jsx kita menyimpan month: 'April'
        // Jika Bima mengikuti kode Transaksi.jsx yang saya berikan sebelumnya, filternya seperti ini:
        const itemMonth = item.date.split('/')[1]; // Mengambil '04' dari '18/04/2026'
        const monthsMap = {
            'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04',
            'Mei': '05', 'Juni': '06', 'Juli': '07', 'Agustus': '08',
            'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
        };
        return itemMonth === monthsMap[selectedMonth];
    });

    setDataBulanan(filtered);
    setShowReport(true);
    setCurrentPage(1); 
  };

  const handleMonthChange = (e) => {
      setSelectedMonth(e.target.value);
      setShowReport(false); 
  };

  // Logic Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = showReport ? dataBulanan.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(dataBulanan.length / itemsPerPage);

  // Hitung Total Pendapatan dari data yang sudah difilter
  const totalPendapatan = dataBulanan.reduce((acc, curr) => acc + curr.subtotal, 0);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 50px' },
    headerUser: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '10px' },
    userProfile: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' },
    userIcon: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e5e7eb' },
    pageTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937' },
    filterContainer: { display: 'flex', gap: '12px', marginBottom: '25px', alignItems: 'center' },
    selectInput: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', minWidth: '200px', outline: 'none' },
    disabledInput: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', width: '80px', backgroundColor: '#f9fafb', color: '#6b7280', textAlign: 'center' },
    btnTampilkan: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: '0.2s' },
    tableCard: { border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #f3f4f6', fontWeight: 'bold', color: '#374151' },
    td: { padding: '12px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' },
    totalSection: { textAlign: 'right', marginTop: '25px', fontSize: '16px', fontWeight: 'bold', color: '#111827' },
    paginationContainer: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' },
    pageBtn: (isActive) => ({
        width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
        backgroundColor: isActive ? '#2563eb' : 'white',
        color: isActive ? 'white' : '#374151',
        transition: '0.2s'
    }),
    arrowBtn: { width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#f9fafb', color: '#374151' }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <div style={styles.headerUser}>
            <div style={styles.userProfile}>
                <span>{userName}</span>
                <div style={styles.userIcon}>👤</div>
            </div>
        </div>

        <h2 style={styles.pageTitle}>Data Penjualan Bulanan</h2>

        <div style={styles.filterContainer}>
            <select style={styles.selectInput} value={selectedMonth} onChange={handleMonthChange}>
                <option value="">Pilih nama bulan...</option>
                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <input type="text" value="2026" readOnly style={styles.disabledInput} />
            <button style={styles.btnTampilkan} onClick={handleTampilkan}>Tampilkan Laporan</button>
        </div>

        <div style={styles.tableCard}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>No</th>
                        <th style={styles.th}>Tanggal</th>
                        <th style={styles.th}>Produk</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Jumlah</th>
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
                                <td style={styles.td}>{item.product}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{item.qty}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{formatRupiah(item.price)}</td>
                                <td style={{ ...styles.td, textAlign: 'center' }}>{formatRupiah(item.subtotal)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                                {showReport ? "Tidak ada data pada bulan ini." : "Silakan pilih bulan dan klik Tampilkan Laporan."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showReport && currentItems.length > 0 && (
                <div>
                    <div style={styles.totalSection}>
                        Total Pendapatan {selectedMonth}: <span style={{color:'#2563eb'}}>{formatRupiah(totalPendapatan)}</span>
                    </div>

                    {totalPages > 1 && (
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

                            <button style={styles.arrowBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                <FaChevronRight size={10} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RekapBulanan;