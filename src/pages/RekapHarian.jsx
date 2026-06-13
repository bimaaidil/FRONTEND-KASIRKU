import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const RekapHarian = () => {
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState(''); 
  const [showReport, setShowReport] = useState(false);
  const [currentData, setCurrentData] = useState([]);

  const handleTampilkan = () => {
    if (selectedDay === '') {
        alert("Silakan pilih hari terlebih dahulu!");
        return;
    }
    const allHistory = JSON.parse(localStorage.getItem('historyTransaksi')) || [];
    const filtered = allHistory.filter(item => item.day === selectedDay);
    setCurrentData(filtered);
    setShowReport(true); 
  };

  const handleDayChange = (e) => {
      setSelectedDay(e.target.value);
      setShowReport(false); 
  };

  const totalPendapatan = currentData.reduce((acc, curr) => acc + curr.subtotal, 0);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(num);

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 50px' },
    pageTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#1f2937' },
    filterContainer: { display: 'flex', gap: '12px', marginBottom: '25px', alignItems: 'center' },
    selectInput: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', minWidth: '180px', outline: 'none' },
    disabledInput: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', width: '130px', backgroundColor: '#f9fafb', color: '#6b7280', textAlign: 'center' },
    btnTampilkan: { backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    tableCard: { border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minHeight: '250px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #f3f4f6', fontWeight: 'bold', color: '#374151' },
    td: { padding: '12px', borderBottom: '1px solid #f3f4f6', color: '#4b5563' },
    totalSection: { textAlign: 'right', marginTop: '25px', fontSize: '16px', fontWeight: 'bold', color: '#111827' }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <h2 style={styles.pageTitle}>Data Penjualan Harian</h2>

        <div style={styles.filterContainer}>
            <select style={styles.selectInput} value={selectedDay} onChange={handleDayChange}>
                <option value="">Pilih nama hari...</option>
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(day => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
            <input type="text" value="Bulan Sekarang" readOnly style={styles.disabledInput} />
            <button style={styles.btnTampilkan} onClick={handleTampilkan}>Tampilkan Laporan</button>
        </div>

        <div style={styles.tableCard}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>No</th>
                        <th style={styles.th}>Tanggal Transaksi</th>
                        <th style={styles.th}>Produk</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Jumlah</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Harga</th>
                        <th style={{ ...styles.th, textAlign: 'center' }}>Sub Total</th>
                    </tr>
                </thead>
                <tbody>
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
                        <tr>
                            <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                                {showReport ? "Tidak ada transaksi pada hari ini." : "Silakan pilih hari untuk melihat rekap."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showReport && currentData.length > 0 && (
                <div style={styles.totalSection}>
                    Total Pendapatan {selectedDay}: <span style={{color: '#2563eb'}}>Rp {formatRupiah(totalPendapatan)}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RekapHarian;