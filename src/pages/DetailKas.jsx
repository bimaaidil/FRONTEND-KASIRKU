// src/pages/DetailKas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMoneyBillWave, FaArrowUp } from 'react-icons/fa'; // Icon simulasi

const DetailKas = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Ambil data dari LocalStorage
    const savedData = localStorage.getItem('kasData');
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    }
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const styles = {
    container: { minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    header: { padding: '20px 40px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' },
    backBtn: { background: 'none', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: 'black' },
    content: { padding: '0' },
    
    // Transaction Row
    transactionRow: { borderBottom: '1px solid #ddd' },
    
    // Header Row (Icon + Title + Amount)
    rowHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px' },
    leftSection: { display: 'flex', alignItems: 'center', gap: '15px' },
    
    // Icons
    iconBox: (type) => ({
        width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${type === 'Uang Masuk' ? '#2ecc71' : '#e74c3c'}`, // Hijau / Merah
        borderRadius: '4px', color: type === 'Uang Masuk' ? '#2ecc71' : '#e74c3c'
    }),
    
    titleText: (type) => ({
        fontSize: '14px', fontWeight: '600', color: type === 'Uang Masuk' ? '#2ecc71' : '#e74c3c'
    }),
    
    amountText: (type) => ({
        fontSize: '14px', fontWeight: 'bold', color: type === 'Uang Masuk' ? '#2ecc71' : '#e74c3c'
    }),

    // Details Section (Keterangan, Waktu, Nama)
    detailsSection: { padding: '10px 40px 10px 85px', borderTop: '1px solid #f5f5f5' },
    detailLabel: { fontSize: '11px', color: '#888', marginBottom: '2px', display: 'block', fontWeight: '600' },
    detailRowFlex: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', color: 'black', marginBottom: '10px' },
    
    // Catatan Section
    noteSection: { padding: '0 40px 15px 85px' },
    noteText: { fontSize: '12px', fontWeight: 'bold', color: 'black' }
  };

  return (
    <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate('/rekap-kas')}>
                <FaArrowLeft /> Detail Kas
            </button>
        </div>

        {/* Content List */}
        <div style={styles.content}>
            {transactions.length > 0 ? (
                transactions.map((item) => (
                    <div key={item.id} style={styles.transactionRow}>
                        
                        {/* Baris Atas: Icon, Judul, Harga */}
                        <div style={styles.rowHeader}>
                            <div style={styles.leftSection}>
                                <div style={styles.iconBox(item.type)}>
                                    {item.type === 'Uang Masuk' ? <FaMoneyBillWave size={14} /> : <FaArrowUp size={14} />}
                                </div>
                                <span style={styles.titleText(item.type)}>{item.type}</span>
                            </div>
                            <span style={styles.amountText(item.type)}>
                                {item.type === 'Uang Masuk' ? '+' : '-'}{formatRupiah(item.amount).replace('Rp', 'Rp')}
                            </span>
                        </div>

                        {/* Baris Detail: Keterangan Waktu & User */}
                        <div style={styles.detailsSection}>
                            <span style={styles.detailLabel}>Keterangan :</span>
                            <div style={styles.detailRowFlex}>
                                <span>Waktu</span>
                                <span>{item.date} {item.time}</span>
                            </div>
                            <div style={styles.detailRowFlex}>
                                <span>Nama Kasir</span>
                                <span>{item.user}</span>
                            </div>
                        </div>

                        {/* Baris Catatan */}
                        <div style={styles.noteSection}>
                            <span style={styles.detailLabel}>Catatan :</span>
                            <span style={styles.noteText}>{item.description}</span>
                        </div>

                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    Belum ada data kas masuk/keluar.
                </div>
            )}
        </div>
    </div>
  );
};

export default DetailKas;