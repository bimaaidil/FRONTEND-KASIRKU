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
    const tempWeather = JSON.parse(localStorage.getItem('tempWeatherData')) || { suhu: 0, kondisi: "Tidak Diketahui" };

    try {
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
        print("✅ Data berhasil dikirim ke Flask di Vercel");
      } catch (err) {
        console.error("❌ Gagal mengirim ke Flask Production:", err);
      }

      await addDoc(collection(db, "transactions"), {
        total_harga: totalPrice,
        pembayaran: "Tunai",
        waktu: serverTimestamp(),
        items: savedCart,
        suhu: tempWeather.suhu,
        conditions_cuaca: tempWeather.kondisi
      });

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

      const transactionData = {
        totalPrice: totalPrice,
        receivedAmount: numericAmount,
        change: change,
        date: now.toISOString()
      };
      localStorage.setItem('lastTransaction', JSON.stringify(transactionData));
      
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
        {/* Header Navigation */}
        <div className="bg-white px-3 px-md-4 py-3 shadow-sm border-bottom d-flex align-items-center justify-content-between">
            <button className="btn btn-link text-dark fw-bold d-flex align-items-center gap-2 p-0 text-decoration-none" onClick={() => navigate('/pembayaran')}>
                <FaArrowLeft /> Tunai
            </button>
            <div className="fw-bold text-primary fs-5">{formatRupiah(totalPrice)}</div>
        </div>

        {/* Form Input Kasir */}
        <div className="container py-4 px-3" style={{ maxWidth: '550px' }}>
          <div className="card border-0 shadow-sm p-4 bg-white rounded-3 mb-3 text-center">
            <div className="mb-4">
                <input 
                  type="number" 
                  placeholder="Input nominal uang diterima..." 
                  className="form-control bg-light py-3 text-center fs-4 fw-bold font-monospace shadow-none rounded-3 mb-3" 
                  value={receivedAmount} 
                  onChange={(e) => setReceivedAmount(e.target.value)} 
                />
                <button className="btn btn-primary w-100 fw-bold py-2.5 rounded-3 border-0 shadow-sm" style={{ backgroundColor: '#154784' }} onClick={() => setReceivedAmount(totalPrice.toString())}>
                  Uang Pas (Pas Tanpa Kembalian)
                </button>
            </div>

            {/* Rekomendasi Lembaran Uang Pintar */}
            <div className="text-start">
                <span className="fw-bold text-secondary small d-block mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>Saran Nominal Cepat</span>
                <div className="row g-2">
                    {uniqueAmounts.map((amount, idx) => (
                        <div key={idx} className="col-6">
                          <button className="btn btn-outline-secondary w-100 py-2.5 fw-semibold font-monospace rounded-3 bg-white" style={{ fontSize: '14px' }} onClick={() => handleQuickAmount(amount)}>
                              {formatRupiah(amount).replace(',00', '')}
                          </button>
                        </div>
                    ))}
                </div>
            </div>

            {receivedAmount && (
                <button className="btn btn-success w-100 fw-bold py-3 rounded-3 border-0 mt-4 fs-6 shadow" style={{ backgroundColor: '#27ae60' }} onClick={() => handleProcessPayment(receivedAmount)}>
                  Proses & Validasi Pembayaran
                </button>
            )}
          </div>
        </div>
    </div>
  );
};

export default Tunai;