// src/pages/PrediksiStok.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// --- 1. IMPORT SERVICE API & FIREBASE ---
import { getPredictionData } from '../services/ai_api';
import { db } from '../config/firebase'; 
import { collection, getDocs, query, where, doc, updateDoc, increment } from "firebase/firestore";

import { FaInfoCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, AlertCircle, CheckCircle, TrendingUp, Loader, ShoppingCart, PackageCheck } from 'lucide-react';

const PrediksiStok = () => {
  const navigate = useNavigate();

  // --- FUNGSI TANGGAL ---
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDateIndo = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [weatherData, setWeatherData] = useState({ condition: '-', temp: 0, insight: 'Memuat data...' });
  const [chartData, setChartData] = useState([]);
  const [recommendationData, setRecommendationData] = useState([]);

  // --- LOAD DATA ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const result = await getPredictionData(selectedDate);
      if (result) {
        setWeatherData(result.weather);
        setChartData(result.chart);
        setRecommendationData(result.recommendations);
      }
    } catch (error) {
      console.error("Gagal prediksi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedDate]);

  // --- FUNGSI 1: BELI SATUAN ---
  const handleKonfirmasiBelanja = async (itemName, amount, unit) => {
    const confirmMessage = 
      `KONFIRMASI BELANJA\n\n` +
      `Bahan: ${itemName}\n` +
      `Jumlah Saran: ${amount} ${unit}\n\n` +
      `Apakah Anda membeli sesuai saran sistem? Jika YA, stok akan otomatis bertambah.`;
    
    if (window.confirm(confirmMessage)) {
      setIsUpdating(true);
      try {
        const q = query(collection(db, "products"), where("nama", "==", itemName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const productRef = doc(db, "products", querySnapshot.docs[0].id);
          await updateDoc(productRef, { stok: increment(amount) });
          alert(`✅ Berhasil! Stok ${itemName} telah diperbarui.`);
          fetchAllData(); 
        } else {
          alert(`❌ Produk "${itemName}" tidak ditemukan.`);
        }
      } catch (error) {
        alert("Gagal memperbarui stok.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // --- FUNGSI 2: BELI SEMUA (MASSAL) ---
  const handleBeliSemua = async () => {
    const itemsToBuy = recommendationData.filter(item => item.currentStock < item.predicted);
    
    if (itemsToBuy.length === 0) {
      alert("Semua stok sudah aman.");
      return;
    }

    const confirmMessage = 
      `KONFIRMASI BELANJA MASSAL\n\n` +
      `Terdapat ${itemsToBuy.length} produk yang perlu dibeli.\n` +
      `Apakah Anda sudah membeli SEMUA buah/bahan sesuai saran Bi-LSTM?\n\n` +
      `Sistem akan memperbarui stok 25+ produk secara otomatis.`;

    if (window.confirm(confirmMessage)) {
      setIsUpdating(true);
      try {
        await Promise.all(
          itemsToBuy.map(async (item) => {
            const amount = item.predicted - item.currentStock;
            const q = query(collection(db, "products"), where("nama", "==", item.name));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const productRef = doc(db, "products", querySnapshot.docs[0].id);
              return updateDoc(productRef, { stok: increment(amount) });
            }
          })
        );
        alert(`✅ Sukses! Stok ${itemsToBuy.length} produk berhasil diperbarui secara massal.`);
        fetchAllData();
      } catch (error) {
        alert("Terjadi kesalahan pada update massal.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Logika Status Tombol
  const getActionStatus = (current, needed) => {
    if (current < needed) {
      const diff = needed - current;
      return { 
        status: 'BELI', 
        amount: diff, 
        color: '#fee2e2', 
        textColor: '#dc2626', 
        icon: <AlertCircle size={16} style={{marginRight:4}} /> 
      };
    }
    return { 
      status: 'AMAN', 
      amount: 0, 
      color: '#dcfce7', 
      textColor: '#16a34a', 
      icon: <CheckCircle size={16} style={{marginRight:4}} /> 
    };
  };

  // Styles
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 40px', backgroundColor: '#F5F6FA' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '24px' },
    weatherCard: { background: 'linear-gradient(to right, #3b82f6, #2563eb)', borderRadius: '12px', padding: '24px', color: 'white', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)', position: 'relative', overflow: 'hidden' },
    tableHeader: { textAlign: 'left', padding: '16px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6' },
    tableCell: { padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f9fafb' },
    infoBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', border: '1px solid #bae6fd' },
    btnBeli: {
        display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: '99px',
        fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
        transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(220, 38, 38, 0.1)'
    },
    btnBeliSemua: {
        backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px',
        border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex',
        alignItems: 'center', gap: '8px', fontSize: '13px', transition: '0.3s'
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.mainContent}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.pageTitle}>Prediksi Stok (Bi-LSTM)</h2>
            <div style={{display:'flex', gap:'10px', marginTop:'8px', alignItems:'center'}}>
                <span style={{color: '#6b7280', fontSize: '14px'}}>Target Prediksi: <b>Besok ({formatDateIndo(selectedDate)})</b></span>
            </div>
          </div>
          
          <div style={styles.infoBadge}>
             <FaInfoCircle size={16} />
             <div>
                <b>Logika AI:</b> Menggunakan data penjualan <b>Hari Ini ({formatDateIndo(getTodayDate())})</b>
             </div>
          </div>
        </div>

        {loading ? (
             <div style={{height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#6b7280'}}>
                <Loader className="animate-spin" size={40} color="#3b82f6" />
                <p style={{marginTop: '15px'}}>Menganalisis pola penjualan & cuaca...</p>
            </div>
        ) : (
        <>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px'}}>
                <div style={styles.weatherCard}>
                    <div style={{position: 'relative', zIndex: 1}}>
                        <p style={{fontSize: '13px', color: '#dbeafe', marginBottom: '4px'}}>Ramalan Cuaca Besok</p>
                        <h2 style={{fontSize: '36px', fontWeight: 'bold', marginBottom: '8px'}}>{weatherData.temp}°C</h2>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
                            <Sun color="#fde047" size={24} />
                            <span style={{fontSize: '18px', fontWeight: '500'}}>{weatherData.condition}</span>
                        </div>
                        <div style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.5'}}>
                            🤖 <b>AI Insight:</b> {weatherData.insight}
                        </div>
                    </div>
                    <Sun size={100} style={{position: 'absolute', right: '-20px', top: '-20px', color: 'rgba(255,255,255,0.15)'}} />
                </div>

                <div style={styles.card}>
                    <h3 style={{fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
                        <TrendingUp size={18} color="#3b82f6" style={{marginRight: '8px'}} />
                        Visualisasi Tren Penjualan
                    </h3>
                    <div style={{height: '200px', width: '100%'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="date" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Line type="monotone" dataKey="penjualan" name="Penjualan" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TABEL REKOMENDASI */}
            <div style={{...styles.card, padding: 0, overflow: 'hidden'}}>
                <div style={{padding: '20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#1f2937'}}>Rekomendasi Belanja</h3>
                    
                    {/* TOMBOL BELI SEMUA */}
                    <button 
                      onClick={handleBeliSemua} 
                      disabled={isUpdating}
                      style={{
                        ...styles.btnBeliSemua,
                        opacity: isUpdating ? 0.6 : 1
                      }}
                    >
                      <PackageCheck size={18} />
                      {isUpdating ? 'Memproses...' : 'Beli Semua Sesuai Saran'}
                    </button>
                </div>

                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{backgroundColor: '#f9fafb'}}>
                            <th style={styles.tableHeader}>Bahan Baku</th>
                            <th style={{...styles.tableHeader, textAlign: 'center'}}>Stok Sistem</th>
                            <th style={{...styles.tableHeader, textAlign: 'center'}}>Target Bi-LSTM</th>
                            <th style={styles.tableHeader}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recommendationData.map((item) => {
                            const { status, amount, color, textColor, icon } = getActionStatus(item.currentStock, item.predicted);
                            return (
                                <tr key={item.id}>
                                    <td style={{...styles.tableCell, fontWeight: '600'}}>{item.name}</td>
                                    <td style={{...styles.tableCell, textAlign: 'center'}}>
                                        {item.currentStock} <span style={{color: '#9ca3af', fontSize: '11px'}}>{item.unit}</span>
                                    </td>
                                    <td style={{...styles.tableCell, textAlign: 'center'}}>
                                        <span style={{color: '#2563eb', fontWeight: 'bold'}}>{item.predicted}</span> <span style={{color: '#9ca3af', fontSize: '11px'}}>{item.unit}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        {status === 'BELI' ? (
                                            <button 
                                                onClick={() => handleKonfirmasiBelanja(item.name, amount, item.unit)}
                                                disabled={isUpdating}
                                                style={{
                                                    ...styles.btnBeli,
                                                    backgroundColor: color, 
                                                    color: textColor,
                                                    opacity: isUpdating ? 0.6 : 1
                                                }}
                                            >
                                                <ShoppingCart size={14} style={{marginRight: 6}} />
                                                BELI {amount} {item.unit}
                                            </button>
                                        ) : (
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', padding: '6px 14px', 
                                                borderRadius: '99px', backgroundColor: color, color: textColor, 
                                                fontSize: '11px', fontWeight: 'bold'
                                            }}>
                                                {icon} AMAN
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
        )}
      </div>
    </div>
  );
};

export default PrediksiStok;