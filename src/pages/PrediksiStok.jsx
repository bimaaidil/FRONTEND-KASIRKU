// src/pages/PrediksiStok.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// --- IMPORT SERVICE API & FIREBASE ---
import { getPredictionData } from '../services/ai_api';
import { db } from '../config/firebase'; 
import { collection, getDocs, query, where, doc, updateDoc, increment, getDoc } from "firebase/firestore";

import { FaInfoCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, AlertCircle, CheckCircle, TrendingUp, Loader, ShoppingCart, PackageCheck, CloudRainWind } from 'lucide-react';

// --- INTEGRASI PEMELIHARAAN ADAPTIF: IMPORT REACT JOYRIDE ---
import Joyride, { STATUS } from 'react-joyride';

const PrediksiStok = () => {
  const navigate = useNavigate();

  // --- FUNGSI TANGGAL ---
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
  const [weatherData, setWeatherData] = useState({ condition: '-', temp: 0, humidity: 0, insight: 'Memuat data...' });
  const [chartData, setChartData] = useState([]);
  const [recommendationData, setRecommendationData] = useState([]);
  const [bahanPelengkapData, setBahanPelengkapData] = useState([]);

  // --- STATE RESPONSIVE REAL-TIME ---
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // --- STATE CONFIGURASI ONBOARDING TOUR (ADAPTIVE MAINTENANCE) ---
  const [runTour, setRunTour] = useState(false);
  const [steps] = useState([
    {
      target: '.tour-weather-card',
      content: 'Bagian ini menampilkan estimasi cuaca esok hari di Pekanbaru beserta AI Insight untuk membantu Anda mempersiapkan potensi fluktuasi penjualan akibat cuaca.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.tour-chart-card',
      content: 'Ini adalah grafik visualisasi tren porsi penjualan harian. Membantu Anda melihat pergerakan naik turunnya transaksi secara komparatif.',
      placement: 'bottom',
    },
    {
      target: '.tour-btn-beli-semua',
      content: 'Klik tombol ini untuk memperbarui seluruh stok buah di database secara massal dan otomatis berdasarkan hasil rekomendasi kuantitas jaringan cerdas Bi-LSTM.',
      placement: 'left',
    }
  ]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- FUNGSI HITUNG KEBUTUHAN BAHAN PELENGKAP BERDASARKAN PREDIKSI AI ---
  const kalkulasiBahanPelengkap = async (predictions) => {
    let butuhGula = 0;
    const safePredictions = Array.isArray(predictions) ? predictions : [];

    safePredictions.forEach(item => {
      const nama = item.name.toLowerCase();
      const qty = item.predicted || 0;

      if (['belimbing', 'jeruk', 'terong belanda', 'timun'].includes(nama)) {
        butuhGula += 120 * qty; 
      } else {
        butuhGula += 100 * qty; 
      }
    });

    let stokGula = 0;
    try {
      const gulaSnap = await getDoc(doc(db, "bahan_pelengkap", "gula"));
      if (gulaSnap.exists()) stokGula = gulaSnap.data().stok_sekarang || 0;
    } catch (e) {
      console.log("Gagal mengambil stok gula:", e);
    }

    setBahanPelengkapData([
      { id: 'gula', name: 'Gula Cair', currentStock: stokGula, predicted: butuhGula, unit: 'gram', isCair: true }
    ]);
  };

  // --- LOAD DATA ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const result = await getPredictionData(selectedDate);
      if (result) {
        if (result.weather) setWeatherData(result.weather);

        if (result.chart && Array.isArray(result.chart)) {
          setChartData(result.chart);
        } else if (result.chart && Array.isArray(result.chart.data)) {
          setChartData(result.chart.data);
        } else {
          setChartData([]);
        }

        let cleanRecommendations = [];
        if (result.recommendations && Array.isArray(result.recommendations)) {
          cleanRecommendations = result.recommendations;
        } else if (result.recommendations && Array.isArray(result.recommendations.data)) {
          cleanRecommendations = result.recommendations.data;
        }
        
        setRecommendationData(cleanRecommendations);
        await kalkulasiBahanPelengkap(cleanRecommendations);
        
        // Aktifkan petunjuk interaktif (Onboarding) setelah data sukses dimuat
        setRunTour(true);
      }
    } catch (error) {
      console.error("Gagal memuat prediksi Bi-LSTM:", error);
      setChartData([]);
      setRecommendationData([]);
      setBahanPelengkapData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedDate]);

  // --- FUNGSI UPDATE DATABASE FIRESTORE ---
  const handleBeliBahanPelengkap = async (docId, name, amount, unit) => {
    const confirmMessage = `KONFIRMASI BELANJA BAHAN PELENGKAP\n\nBahan: ${name}\nJumlah Saran: ${amount} ${unit}\n\nApakah Anda membeli sesuai saran sistem? Jika YA, stok bahan di database akan bertambah.`;
    if (window.confirm(confirmMessage)) {
      setIsUpdating(true);
      try {
        const bahanRef = doc(db, "bahan_pelengkap", docId);
        await updateDoc(bahanRef, { stok_sekarang: increment(amount) });
        alert(`✅ Berhasil! Stok ${name} telah diperbarui.`);
        fetchAllData();
      } catch (error) {
        alert("Gagal memperbarui stok bahan pelengkap.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleKonfirmasiBelanja = async (itemName, amount, unit) => {
    const confirmMessage = `KONFIRMASI BELANJA\n\nBahan: ${itemName}\nJumlah Saran: ${amount} ${unit}\n\nApakah Anda membeli sesuai saran sistem? Jika YA, stok di database akan otomatis bertambah.`;
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
          alert(`❌ Produk "${itemName}" tidak ditemukan di database.`);
        }
      } catch (error) {
        alert("Gagal memperbarui stok.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleBeliSemua = async () => {
    if (!Array.isArray(recommendationData)) return;
    const itemsToBuy = recommendationData.filter(item => item.currentStock < item.predicted);
    
    if (itemsToBuy.length === 0) {
      return alert("Semua stok sudah aman (mencukupi hasil prediksi).");
    }

    const confirmMessage = `KONFIRMASI BELANJA MASSAL\n\nTerdapat ${itemsToBuy.length} produk yang perlu ditambah stoknya.\nApakah Anda sudah membeli SEMUA bahan sesuai saran Bi-LSTM?\n\nSistem akan memperbarui seluruh stok produk secara otomatis.`;
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

  const getActionStatus = (current, needed) => {
    if (current < needed) {
      return { status: 'BELI', amount: needed - current, color: '#fee2e2', textColor: '#dc2626', icon: <AlertCircle size={15} className="me-1" /> };
    }
    return { status: 'AMAN', amount: 0, color: '#dcfce7', textColor: '#16a34a', icon: <CheckCircle size={15} className="me-1" /> };
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }
  };

  // --- STYLES DYNAMIC OPTIMIZATION ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    mainContent: { 
      marginLeft: isMobile ? '0px' : '260px', 
      flex: 1, 
      padding: isMobile ? '70px 15px 40px 15px' : '30px 40px', 
      backgroundColor: '#F5F6FA',
      transition: 'margin 0.3s ease-in-out',
      width: '100%',
      overflowX: 'hidden'
    },
    header: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '15px', marginBottom: '25px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0, paddingLeft: isMobile ? '45px' : '0' }, 
    card: { backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '16px' : '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '24px' },
    topLayoutGrid: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', 
      gap: '20px', 
      marginBottom: '24px' 
    },
    weatherCard: { background: 'linear-gradient(to right, #3b82f6, #2563eb)', borderRadius: '12px', padding: '20px', color: 'white', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)', position: 'relative', overflow: 'hidden' },
    tableHeader: { textAlign: 'left', padding: '14px 16px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6' },
    tableCell: { padding: '14px 16px', fontSize: '13.5px', color: '#374151', borderBottom: '1px solid #f9fafb' },
    infoBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', border: '1px solid #bae6fd', width: isMobile ? '100%' : 'auto' },
    btnBeli: { display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
    btnBeliSemua: { backgroundColor: '#2563eb', color: 'white', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }
  };

  return (
    <div style={styles.container}>
      {/* COMPONENT INTERAKTIF TOUR GUIDE */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#2563eb',
            textColor: '#374151',
            fontFamily: 'Poppins, sans-serif'
          }
        }}
      />

      <Sidebar />

      <div style={styles.mainContent}>
        {/* HEADER RESPONSIVE */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.pageTitle}>Prediksi Stok (Bi-LSTM)</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', paddingLeft: isMobile ? '45px' : '0' }}>
                <span style={{ color: '#6b7280', fontSize: '13.5px' }}>Target: <b>Besok ({formatDateIndo(selectedDate)})</b></span>
            </div>
          </div>
          
          <div style={styles.infoBadge}>
             <FaInfoCircle size={15} className="flex-shrink-0" />
             <div className="small"><b>Analisis AI:</b> Berdasarkan histori penjualan 7 hari terakhir.</div>
          </div>
        </div>

        {loading ? (
             <div className="d-flex flex-column align-items-center justify-content-center text-secondary" style={{ height: '350px' }}>
                <Loader className="animate-spin mb-3 text-primary" size={36} />
                <p className="small">Menganalisis matriks & memproses prediksi jaringan Bi-LSTM...</p>
            </div>
        ) : (
        <>
            {/* GRID CUACA & GRAFIK TREN ADAPTIF */}
            <div style={styles.topLayoutGrid}>
                {/* TARGET TOUR 1: CLASS "tour-weather-card" */}
                <div style={styles.weatherCard} className="tour-weather-card">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p className="small text-light opacity-75 m-0 mb-1">Estimasi Cuaca Esok Hari</p>
                        <div className="d-flex align-items-baseline gap-2">
                            <h2 className="fw-bold m-0" style={{ fontSize: '32px' }}>{weatherData.temp}°C</h2>
                            <span className="small text-white-50">| Hum: {weatherData.humidity ?? '--'}%</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 my-2.5">
                            {weatherData.condition && weatherData.condition.includes("Hujan") && weatherData.temp > 28 ? (
                                <CloudRainWind color="#fde047" size={20} /> 
                            ) : (
                                <Sun color="#fde047" size={20} />
                            )}
                            <span className="fw-semibold" style={{ fontSize: '16px' }}>{weatherData.condition}</span>
                        </div>
                        <div className="rounded p-2.5 rounded-3 border-0 mt-2 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.18)', fontSize: '11.5px', lineHeight: '1.4' }}>
                            🤖 <b>AI Insight:</b> {weatherData.temp > 28 && weatherData.condition && weatherData.condition.includes("Hujan") 
                                ? "Waspada hujan panas/pengap. Penjualan minuman dingin biasanya tetap tinggi karena kelembapan udara." 
                                : weatherData.insight}
                        </div>
                    </div>
                    <Sun size={80} className="position-absolute opacity-15" style={{ right: '-15px', top: '-15px' }} />
                </div>

                {/* GRAFIK VISUALISASI RECHARTS - TARGET TOUR 2: CLASS "tour-chart-card" */}
                <div style={styles.card} className="tour-chart-card">
                    <h3 className="fw-semibold text-secondary mb-3 d-flex align-items-center" style={{ fontSize: '15px' }}>
                        <TrendingUp size={16} className="text-primary me-2" /> Visualisasi Tren Porsi Penjualan
                    </h3>
                    <div style={{ height: '180px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '12px' }} />
                                <Line type="monotone" dataKey="penjualan" name="Penjualan" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* TABEL 1: REKOMENDASI BELANJA BUAH UTAMA */}
            <div style={{ ...styles.card, padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
                <div className="p-3 border-bottom border-light d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2.5">
                    <h3 className="fw-bold text-dark m-0" style={{ fontSize: '15px' }}>Rekomendasi Belanja Buah Utama</h3>
                    {/* TARGET TOUR 3: CLASS "tour-btn-beli-semua" */}
                    <button onClick={handleBeliSemua} disabled={isUpdating} className="w-100 w-sm-auto justify-content-center tour-btn-beli-semua" style={styles.btnBeliSemua}>
                      <PackageCheck size={16} />
                      {isUpdating ? 'Memperbarui...' : 'Beli Semua Sesuai AI'}
                    </button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle text-nowrap m-0">
                      <thead>
                          <tr className="bg-light text-secondary small">
                              <th style={styles.tableHeader}>Nama Buah</th>
                              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Stok Sistem</th>
                              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Target Bi-LSTM</th>
                              <th style={styles.tableHeader}>Aksi</th>
                          </tr>
                      </thead>
                      <tbody>
                          {recommendationData.map((item) => {
                              const { status, amount, color, textColor, icon } = getActionStatus(item.currentStock, item.predicted);
                              return (
                                  <tr key={item.id} className="border-top">
                                      <td className="fw-bold text-dark ps-3">{item.name}</td>
                                      <td className="text-center text-muted">
                                          {item.currentStock} <span style={{ fontSize: '11px' }}>{item.unit}</span>
                                      </td>
                                      <td className="text-center fw-bold text-primary">
                                          {item.predicted} <span className="text-muted fw-normal" style={{ fontSize: '11px' }}>{item.unit}</span>
                                      </td>
                                      <td className="pe-3">
                                          {status === 'BELI' ? (
                                              <button 
                                                  onClick={() => handleKonfirmasiBelanja(item.name, amount, item.unit)}
                                                  disabled={isUpdating}
                                                  className="fw-bold d-inline-flex align-items-center shadow-sm"
                                                  style={{ ...styles.btnBeli, backgroundColor: color, color: textColor, opacity: isUpdating ? 0.6 : 1 }}
                                              >
                                                  <ShoppingCart size={12} className="me-1.5" /> BELI {amount} {item.unit}
                                              </button>
                                          ) : (
                                              <div className="d-inline-flex align-items-center px-3 py-1 rounded-pill fw-bold" style={{ backgroundColor: color, color: textColor, fontSize: '11px' }}>
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
            </div>

            {/* TABEL 2: REKOMENDASI PEMBELIAN BAHAN PELENGKAP GULA */}
            <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
                <div className="p-3 border-bottom border-light">
                    <h3 className="fw-bold text-dark m-0" style={{ fontSize: '15px' }}>Rekomendasi Belanja Bahan Pelengkap Besok</h3>
                    <p className="text-muted m-0 mt-0.5" style={{ fontSize: '12px' }}>Kalkulasi porsi resep rekapitulasi otomatis berdasarkan matriks AI.</p>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle text-nowrap m-0">
                      <thead>
                          <tr className="bg-light text-secondary small">
                              <th style={styles.tableHeader}>Bahan Baku Pelengkap</th>
                              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Stok Gudang</th>
                              <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Kebutuhan Porsi</th>
                              <th style={styles.tableHeader}>Rekomendasi Aksi</th>
                          </tr>
                      </thead>
                      <tbody>
                          {bahanPelengkapData.map((item) => {
                              const { status, amount, color, textColor, icon } = getActionStatus(item.currentStock, item.predicted);
                              
                              const displayCurrent = `${(item.currentStock / 1000).toFixed(2)} kg`;
                              const displayNeeded = `${(item.predicted / 1000).toFixed(2)} kg`;
                              const displayAmount = `${(amount / 1000).toFixed(2)} kg`;

                              return (
                                  <tr key={item.id} className="border-top">
                                      <td className="fw-bold text-dark ps-3">{item.name}</td>
                                      <td className="text-center text-muted">{displayCurrent}</td>
                                      <td className="text-center fw-bold text-primary">{displayNeeded}</td>
                                      <td className="pe-3">
                                          {status === 'BELI' ? (
                                              <button 
                                                  onClick={() => handleBeliBahanPelengkap(item.id, item.name, amount, item.unit)}
                                                  disabled={isUpdating}
                                                  className="fw-bold d-inline-flex align-items-center shadow-sm"
                                                  style={{ ...styles.btnBeli, backgroundColor: color, color: textColor, opacity: isUpdating ? 0.6 : 1 }}
                                              >
                                                  <ShoppingCart size={12} className="me-1.5" /> BELI {displayAmount}
                                              </button>
                                          ) : (
                                              <div className="d-inline-flex align-items-center px-3 py-1 rounded-pill fw-bold" style={{ backgroundColor: color, color: textColor, fontSize: '11px' }}>
                                                  {icon} STOK CUKUP
                                              </div>
                                          )}
                                      </td>
                                  </tr>
                              )
                          })}
                      </tbody>
                  </table>
                </div>
            </div>
        </>
        )}
      </div>
    </div>
  );
};

export default PrediksiStok;