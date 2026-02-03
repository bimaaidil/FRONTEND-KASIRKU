// src/pages/PrediksiStok.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 

// --- 1. IMPORT SERVICE API BARU ---
import { getPredictionData } from '../services/ai_api';

// Icon untuk Sidebar
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
// Icon & Chart untuk Fitur Prediksi
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, AlertCircle, CheckCircle, TrendingUp, Calendar, Loader } from 'lucide-react';

const PrediksiStok = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('Besok, 28 Jan 2026');

  // --- 2. STATE DATA DINAMIS (Menggantikan Dummy Data) ---
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({ condition: '-', temp: 0, insight: 'Memuat data...' });
  const [chartData, setChartData] = useState([]);
  const [recommendationData, setRecommendationData] = useState([]);

  // --- 3. FUNGSI AMBIL DATA DARI PYTHON (Backend) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Memanggil Backend Python...");
        // Panggil fungsi dari api.js
        const result = await getPredictionData(selectedDate);
        
        // Masukkan data dari Python ke State React
        if (result) {
          setWeatherData(result.weather);
          setChartData(result.chart);
          setRecommendationData(result.recommendations);
        }
      } catch (error) {
        console.error("Gagal mengambil data prediksi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]); // Dijalankan setiap kali tanggal berubah

  // Fungsi Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Logika Status (Beli / Aman)
  const getActionStatus = (current, needed) => {
    if (current < needed) {
      const diff = needed - current;
      return { 
        status: 'BELI', 
        amount: diff, 
        color: '#fee2e2', // Red-100
        textColor: '#dc2626', // Red-600
        icon: <AlertCircle size={16} style={{marginRight:4}} />
      };
    }
    return { 
      status: 'AMAN', 
      amount: 0, 
      color: '#dcfce7', // Green-100
      textColor: '#16a34a', // Green-600
      icon: <CheckCircle size={16} style={{marginRight:4}} />
    };
  };

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    sidebar: { width: '260px', backgroundColor: '#154784', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', position: 'fixed', height: '100vh', zIndex: 10 },
    logoSection: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '12px' },
    menuSectionTitle: { fontSize: '11px', color: '#a0c4eb', marginTop: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '5px' },
    menuItem: { padding: '8px 12px', marginBottom: '2px', borderRadius: '6px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', transition: '0.2s' },
    activeMenu: { backgroundColor: '#427dfc', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontWeight: '600' }, 
    divider: { borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' },
    
    // Main Content
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 40px', backgroundColor: '#F5F6FA' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
    
    // Components Styles
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '24px' },
    weatherCard: { background: 'linear-gradient(to right, #3b82f6, #2563eb)', borderRadius: '12px', padding: '24px', color: 'white', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)', position: 'relative', overflow: 'hidden' },
    tableHeader: { textAlign: 'left', padding: '16px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6' },
    tableCell: { padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f9fafb' }
  };

  return (
    <div style={styles.container}>
      
      {/* === SIDEBAR (Manual Code sesuai Profile.jsx) === */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <img src={logoImg} alt="Logo" style={{ width: '35px', borderRadius: '5px' }} />
          <h4 className="m-0 fw-bold" style={{ fontSize: '18px' }}>Kasirku</h4>
        </div>
        <div style={styles.divider}></div>
        
        <div style={styles.menuItem} onClick={() => navigate('/absensi')}>
          <FaCalendarCheck size={16} /> <span>Absensi</span>
        </div>
        
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Fitur Cerdas</div>
        {/* Menu Aktif saat ini */}
        <div style={{...styles.menuItem, ...styles.activeMenu}}>
            <FaChartLine size={14} /> <span>Prediksi Stok</span>
        </div>

        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Karyawan</div>
        <div style={styles.menuItem} onClick={() => navigate('/kelola-karyawan')}>
            <FaUserFriends size={14} /> <span>Kelola Karyawan</span>
        </div>
        
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Barang</div>
        <div style={styles.menuItem} onClick={() => navigate('/kelola-produk')}>
            <FaBox size={14} /> <span>Kelola Produk</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/transaksi')}>
            <FaExchangeAlt size={14} /> <span>Transaksi</span>
        </div>  

        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Laporan</div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-harian')}>
            <FaFileAlt size={14} /> <span>Rekap Harian</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-bulanan')}>
            <FaFileAlt size={14} /> <span>Rekap Bulanan</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-kas')}>
            <FaFileAlt size={14} /> <span>Rekap Kas</span>
        </div>
        
        <div style={{ marginTop: 'auto', cursor: 'pointer', ...styles.menuItem }} onClick={handleLogout}>
            <FaSignOutAlt /> <span>Keluar</span>
        </div>
      </div>

      {/* === MAIN CONTENT (Fitur Prediksi) === */}
      <div style={styles.mainContent}>
        
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.pageTitle}>Prediksi Stok Harian (Bi-LSTM)</h2>
            <p style={{color: '#6b7280', fontSize: '14px', marginTop: '4px'}}>Analisis stok cerdas berbasis cuaca untuk efisiensi belanja.</p>
          </div>
          <div style={{display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <Calendar size={16} color="#6b7280" style={{marginRight: '8px'}} />
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{border: 'none', outline: 'none', color: '#374151', fontSize: '14px', fontWeight: '500'}}
            >
              <option>Besok, 28 Jan 2026</option>
              <option>Lusa, 29 Jan 2026</option>
            </select>
          </div>
        </div>

        {/* --- 4. INDIKATOR LOADING & KONTEN --- */}
        {loading ? (
             <div style={{height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#6b7280'}}>
                <Loader className="animate-spin" size={40} color="#3b82f6" />
                <p style={{marginTop: '15px'}}>Sedang memproses data dengan AI...</p>
            </div>
        ) : (
        <>
            {/* Content Grid */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px'}}>
            
            {/* Card Cuaca */}
            <div style={styles.weatherCard}>
                <div style={{position: 'relative', zIndex: 1}}>
                    <p style={{fontSize: '13px', color: '#dbeafe', marginBottom: '4px'}}>Prakiraan Cuaca</p>
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

            {/* Card Grafik */}
            <div style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                    <h3 style={{fontSize: '16px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center'}}>
                        <TrendingUp size={18} color="#3b82f6" style={{marginRight: '8px'}} />
                        Tren Penjualan vs Suhu
                    </h3>
                </div>
                <div style={{height: '200px', width: '100%'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="date" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="penjualan" name="Penjualan (Qty)" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
            </div>

            {/* Tabel Rekomendasi */}
            <div style={{...styles.card, padding: 0, overflow: 'hidden'}}>
                <div style={{padding: '20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#1f2937'}}>Rekomendasi Belanja Bahan Baku</h3>
                    <button style={{backgroundColor: '#1f2937', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer'}}>
                        Cetak Daftar Belanja
                    </button>
                </div>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{backgroundColor: '#f9fafb'}}>
                            <th style={styles.tableHeader}>Nama Bahan</th>
                            <th style={{...styles.tableHeader, textAlign: 'center'}}>Stok Gudang</th>
                            <th style={{...styles.tableHeader, textAlign: 'center'}}>Prediksi Butuh (AI)</th>
                            <th style={styles.tableHeader}>Status & Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recommendationData.map((item) => {
                            const { status, amount, color, textColor, icon } = getActionStatus(item.currentStock, item.predicted);
                            return (
                                <tr key={item.id}>
                                    <td style={{...styles.tableCell, fontWeight: '500'}}>{item.name}</td>
                                    <td style={{...styles.tableCell, textAlign: 'center'}}>
                                        {item.currentStock} <span style={{color: '#9ca3af', fontSize: '12px'}}>{item.unit}</span>
                                    </td>
                                    <td style={{...styles.tableCell, textAlign: 'center'}}>
                                        <span style={{color: '#2563eb', fontWeight: 'bold'}}>{item.predicted}</span> <span style={{color: '#9ca3af', fontSize: '12px'}}>{item.unit}</span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '99px',
                                            backgroundColor: color, color: textColor, fontSize: '12px', fontWeight: 'bold'
                                        }}>
                                            {icon}
                                            {status === 'BELI' ? `BELI ${amount} ${item.unit}` : 'STOK AMAN'}
                                        </div>
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