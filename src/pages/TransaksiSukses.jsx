// src/pages/TransaksiSukses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const TransaksiSukses = () => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    // 1. Ambil data transaksi terakhir dari LocalStorage
    const savedTransaction = localStorage.getItem('lastTransaction');
    
    if (savedTransaction) {
      setTransaction(JSON.parse(savedTransaction));
    } else {
      // Jika user refresh halaman tapi tidak ada data transaksi, kembalikan ke menu
      navigate('/transaksi');
    }
  }, [navigate]);

  // Format Rupiah
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Format Tanggal (Contoh: 05-November-2025, 16:03)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString); // Konversi string kembali ke Date object
    
    // Opsi format tanggal bahasa Indonesia
    const options = { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    };
    
    // Mengganti format default browser agar sesuai "DD-Month-YYYY, HH:MM"
    return date.toLocaleDateString('id-ID', options).replace('pukul', ','); 
  };

  // Handler: Tombol Transaksi Baru
  const handleNewTransaction = () => {
    localStorage.removeItem('lastTransaction'); // Bersihkan data transaksi lama
    navigate('/transaksi'); // Kembali ke halaman menu
  };

  // Handler: Tombol Cetak
  const handlePrint = () => {
    window.print(); // Membuka dialog print bawaan browser
  };

  // Jangan render apa-apa jika data belum siap
  if (!transaction) return null;

  // --- STYLES ---
  const styles = {
    container: { 
        minHeight: '100vh', 
        backgroundColor: 'white', 
        fontFamily: "'Poppins', sans-serif", 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    contentCard: { 
        width: '100%', 
        maxWidth: '500px', 
        padding: '40px', 
        textAlign: 'center' 
    },
    
    // Ikon Centang Hijau
    iconContainer: { 
        fontSize: '80px', 
        color: '#2ecc71', // Warna Hijau Sukses
        marginBottom: '20px' 
    }, 
    
    title: { 
        fontSize: '24px', 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: '5px' 
    },
    date: { 
        fontSize: '14px', 
        color: '#666', 
        marginBottom: '40px', 
        fontWeight: '600' 
    },
    
    // Bagian Rincian Harga
    detailsContainer: {
        textAlign: 'left',
        marginBottom: '40px',
        padding: '0 20px'
    },
    detailRow: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '15px', 
        fontSize: '15px', 
        color: '#333' 
    },
    detailLabel: { 
        fontWeight: '500',
        color: '#555' 
    },
    detailValue: { 
        fontWeight: 'bold',
        color: '#333'
    },
    
    // Tombol Cetak (Putih Border Abu)
    printBtn: { 
        width: '100%', 
        padding: '15px', 
        backgroundColor: 'white', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: '#333', 
        cursor: 'pointer', 
        marginBottom: '15px', 
        transition: '0.2s',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    
    // Tombol Transaksi Baru (Biru Solid)
    newTransactionBtn: { 
        width: '100%', 
        padding: '15px', 
        backgroundColor: '#154784', 
        border: 'none', 
        borderRadius: '8px', 
        fontSize: '16px', 
        fontWeight: 'bold', 
        color: 'white', 
        cursor: 'pointer', 
        transition: '0.2s',
        boxShadow: '0 4px 10px rgba(21, 71, 132, 0.3)'
    }
  };

  return (
    <div style={styles.container}>
        <div style={styles.contentCard}>
            
            {/* Ikon Centang */}
            <div style={styles.iconContainer}>
                <FaCheckCircle />
            </div>

            {/* Judul & Tanggal */}
            <h2 style={styles.title}>Transaksi Berhasil</h2>
            <p style={styles.date}>{formatDate(transaction.date)}</p>

            {/* Rincian Pembayaran */}
            <div style={styles.detailsContainer}>
                <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Pembayaran</span>
                    <span style={styles.detailValue}>Tunai</span>
                </div>
                <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Total Tagihan</span>
                    <span style={styles.detailValue}>{formatRupiah(transaction.totalPrice)}</span>
                </div>
                <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Diterima</span>
                    <span style={styles.detailValue}>{formatRupiah(transaction.receivedAmount)}</span>
                </div>
                <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Kembalian</span>
                    <span style={styles.detailValue}>{formatRupiah(transaction.change)}</span>
                </div>
            </div>

            {/* Tombol Aksi */}
            <button style={styles.printBtn} onClick={handlePrint}>
                Cetak Struk
            </button>

            <button style={styles.newTransactionBtn} onClick={handleNewTransaction}>
                Transaksi Baru
            </button>

        </div>
    </div>
  );
};

export default TransaksiSukses;