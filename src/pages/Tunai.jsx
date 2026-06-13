// src/pages/Tunai.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { db } from '../config/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Tunai = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState('');

  // Deklarasi URL Server Cloud Vercel Terpusat
  const BASE_SERVER_URL = 'https://backend-kasirku.vercel.app';

  useEffect(() => {
    const savedCart = localStorage.getItem('cartData');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
      setTotalPrice(total);
    }
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const handleProcessPayment = async (amount) => {
    const numericAmount = parseFloat(amount);
    if (numericAmount < totalPrice) {
      alert("Uang yang diterima kurang!");
      return;
    }

    const change = numericAmount - totalPrice;
    const savedCart = JSON.parse(localStorage.getItem('cartData')) || [];
    
    // AMBIL DATA CUACA DARI LOCALSTORAGE
    const tempWeather = JSON.parse(localStorage.getItem('tempWeatherData')) || { suhu: 0, kondisi: "Tidak Diketahui" };

    try {
      // --- 1. SIMPAN KE API FLASK (UNTUK UPDATE CSV & AI) ---
      // PERBAIKAN: Alihkan rute dari localhost ke server cloud Vercel
      try {
        await fetch(`${BASE_SERVER_URL}/api/transaksi`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: savedCart,
            total_harga: totalPrice,
            cuaca: tempWeather.kondisi,
            suhu: tempWeather.suhu
          }),
        });
        console.log("✅ Data berhasil dikirim ke Flask di Vercel");
      } catch (err) {
        console.error("❌ Gagal mengirim ke Flask Production:", err);
      }

      // --- 2. SIMPAN KE FIRESTORE ---
      await addDoc(collection(db, "transactions"), {
        total_harga: totalPrice,
        pembayaran: "Tunai",
        waktu: serverTimestamp(),
        items: savedCart,
        suhu: tempWeather.suhu,
        conditions_cuaca: tempWeather.kondisi
      });

      // --- 3. SIMPAN KE HISTORY LOCAL ---
      const now = new Date();
      const dayName = now.toLocaleDateString('id-ID', { weekday: 'long' });
      const fullDate = now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const existingHistory = JSON.parse(localStorage.getItem('historyTransaksi')) || [];

      const newRecords = savedCart.map(item => ({
        id: Date.now() + Math.random(),
        day: dayName,
        date: fullDate,
        product: item.name,
        qty: item.qty,
        price: item.price,
        subtotal: item.price * item.qty
      }));

      localStorage.setItem('historyTransaksi', JSON.stringify([...newRecords, ...existingHistory]));

      // --- 4. SIMPAN DATA UNTUK STRUK ---
      const transactionData = {
        totalPrice: totalPrice,
        receivedAmount: numericAmount,
        change: change,
        date: now.toISOString()
      };
      localStorage.setItem('lastTransaction', JSON.stringify(transactionData));
      
      // --- 5. CLEANUP ---
      localStorage.removeItem('cartData');
      localStorage.removeItem('tempWeatherData');
      
      navigate('/transaksi-sukses');
    } catch (error) {
      console.error("Error simpan transaksi:", error);
      alert("Terjadi kesalahan saat menyimpan transaksi.");
    }
  };

  const handleQuickAmount = (amount) => { setReceivedAmount(amount.toString()); };

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
                <button style={styles.uangPasBtn} onClick={() => setReceivedAmount(totalPrice.toString())}>Uang Pas</button>
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