// src/pages/Pembayaran.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';

const Pembayaran = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartData');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
      setTotalPrice(total);
    }
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // --- UPDATE BAGIAN INI ---
  const handlePaymentMethod = (method) => {
    if (method === 'Tunai') {
        navigate('/tunai'); // Arahkan ke halaman Tunai
    } else {
        alert(`Metode ${method} belum tersedia.`);
    }
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f4f7fe', fontFamily: "'Poppins', sans-serif" },
    header: { backgroundColor: 'white', padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    backBtn: { background: 'none', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    content: { maxWidth: '800px', margin: '40px auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' },
    totalSection: { padding: '40px', textAlign: 'center', borderBottom: '1px solid #eee' },
    totalLabel: { fontSize: '16px', fontWeight: '600', color: '#555', marginBottom: '10px' },
    totalValue: { fontSize: '36px', fontWeight: 'bold', color: '#154784' },
    paymentSection: { padding: '20px 40px' },
    paymentLabel: { fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'black' },
    paymentOption: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '15px', fontWeight: '500', color: '#333' }
  };

  return (
    <div style={styles.container}>
        <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate('/keranjang')}>
                <FaArrowLeft /> Pembayaran
            </button>
        </div>

        <div style={styles.content}>
            <div style={styles.totalSection}>
                <div style={styles.totalLabel}>Total Tagihan</div>
                <div style={styles.totalValue}>{formatRupiah(totalPrice)}</div>
            </div>

            <div style={styles.paymentSection}>
                <div style={styles.paymentLabel}>Pilih Pembayaran</div>
                <div style={styles.paymentOption} onClick={() => handlePaymentMethod('Tunai')}>
                    <span>Tunai</span>
                    <FaChevronRight color="#aaa" size={14} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Pembayaran;