// src/pages/Tunai.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Tunai = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('cartData');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
      setTotalPrice(total);
    }
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const handleProcessPayment = (amount) => {
    if (amount < totalPrice) {
        alert("Uang yang diterima kurang!");
        return;
    }
    const change = amount - totalPrice;
    
    // Simpan data transaksi sementara untuk ditampilkan di halaman sukses
    const transactionData = {
        totalPrice: totalPrice,
        receivedAmount: amount,
        change: change,
        date: new Date().toLocaleString()
    };
    localStorage.setItem('lastTransaction', JSON.stringify(transactionData));
    
    // Kosongkan keranjang karena transaksi dianggap selesai
    localStorage.removeItem('cartData');
    
    // Arahkan ke halaman sukses
    navigate('/transaksi-sukses');
  };

  const handleQuickAmount = (amount) => {
    setReceivedAmount(amount);
  };

  const quickAmounts = [
    totalPrice, 
    Math.ceil(totalPrice / 5000) * 5000, 
    Math.ceil(totalPrice / 10000) * 10000, 
    totalPrice + 50000 
  ];
  const uniqueAmounts = [...new Set(quickAmounts)].slice(0, 4); 

  const styles = {
    container: { minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid #eee' },
    backBtn: { background: 'none', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    headerTotal: { fontSize: '18px', fontWeight: 'bold', color: '#154784' },
    content: { maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '0 20px' },
    inputGroup: { marginBottom: '30px' },
    input: { width: '100%', padding: '15px', fontSize: '16px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px', outline: 'none' },
    uangPasBtn: { width: '100%', padding: '15px', backgroundColor: '#154784', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
    suggestionSection: { textAlign: 'left' },
    suggestionLabel: { fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', display: 'block' },
    gridContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    amountBtn: { padding: '15px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', fontWeight: '600', color: '#333', cursor: 'pointer', transition: '0.2s' },
    payBtn: { marginTop: '30px', width: '100%', padding: '15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
        <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate('/pembayaran')}>
                <FaArrowLeft /> Tunai
            </button>
            <div style={styles.headerTotal}>{formatRupiah(totalPrice)}</div>
        </div>

        <div style={styles.content}>
            <div style={styles.inputGroup}>
                <input type="number" placeholder="Uang yang diterima" style={styles.input} value={receivedAmount} onChange={(e) => setReceivedAmount(e.target.value)} />
                <button style={styles.uangPasBtn} onClick={() => setReceivedAmount(totalPrice)}>Uang Pas</button>
            </div>

            <div style={styles.suggestionSection}>
                <span style={styles.suggestionLabel}>Jumlah Lain</span>
                <div style={styles.gridContainer}>
                    {uniqueAmounts.map((amount, idx) => (
                        <button key={idx} style={styles.amountBtn} onClick={() => handleQuickAmount(amount)}>
                            {formatRupiah(amount).replace(',00', '')}
                        </button>
                    ))}
                </div>
            </div>

            {receivedAmount && (
                <button style={styles.payBtn} onClick={() => handleProcessPayment(receivedAmount)}>Proses Pembayaran</button>
            )}
        </div>
    </div>
  );
};

export default Tunai;