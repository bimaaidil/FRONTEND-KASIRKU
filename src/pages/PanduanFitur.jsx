// src/pages/PanduanFitur.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  FaChartLine, 
  FaCloudSun, 
  FaShoppingBag, 
  FaInfoCircle, 
  FaLightbulb, 
  FaCheckCircle 
} from 'react-icons/fa';

const PanduanFitur = () => {
  const [isMobile] = useState(window.innerWidth <= 768);

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    mainContent: { 
      marginLeft: isMobile ? '0px' : '260px', 
      flex: 1, 
      padding: isMobile ? '80px 20px 40px 20px' : '40px 40px', 
      backgroundColor: '#F5F6FA' 
    },
    header: { marginBottom: '30px' },
    title: { fontSize: '26px', fontWeight: 'bold', color: '#154784', margin: 0 },
    subtitle: { fontSize: '14px', color: '#6b7280', marginTop: '4px' },
    grid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '25px' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderLeft: '5px solid #2563eb' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
    iconWrapper: { backgroundColor: '#e0f2fe', color: '#2563eb', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    stepList: { paddingLeft: '0', listStyleType: 'none', margin: 0 },
    stepItem: { display: 'flex', gap: '10px', fontSize: '13.5px', color: '#4b5563', marginBottom: '10px', alignItems: 'flex-start', lineHeight: '1.5' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef3c7', color: '#d97706', padding: '8px 12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: '600', marginTop: '20px', width: '100%' }
  };

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.mainContent}>
        {/* HEADER HALAMAN */}
        <div style={styles.header}>
          <h2 style={styles.title}>Pusat Bantuan & Dokumentasi Sistem</h2>
          <p style={styles.subtitle}>Fase Pemeliharaan Adaptif (Adaptive Maintenance) — Panduan Operasional Modul Cerdas AI Kasirku</p>
        </div>

        <div style={styles.grid}>
          {/* KARTU 1: ESTIMASI CUACA */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.iconWrapper}><FaCloudSun size={20} /></div>
              <h4 style={styles.cardTitle}>Fitur Estimasi Cuaca & AI Insight</h4>
            </div>
            <ul style={styles.stepList}>
              <li style={styles.stepItem}>
                <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={14} />
                <span>Menampilkan perkiraan suhu, kelembapan, dan kondisi cuaca di Kota Pekanbaru untuk esok hari secara otomatis.</span>
              </li>
              <li style={styles.stepItem}>
                <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={14} />
                <span><b>AI Insight:</b> Menyediakan narasi rekomendasi kontekstual dari kecerdasan buatan untuk mempersiapkan operasional toko berdasarkan kondisi cuaca.</span>
              </li>
            </ul>
          </div>

          {/* KARTU 2: GRAFIK PREDIKSI */}
          <div style={{ ...styles.card, borderLeftColor: '#10b981' }}>
            <div style={{ ...styles.iconWrapper, backgroundColor: '#d1fae5', color: '#10b981' }}>
              <FaChartLine size={20} />
            </div>
            <h4 style={styles.cardTitle}>Visualisasi Tren Prediksi Bi-LSTM</h4>
            <ul style={styles.stepList}>
              <li style={styles.stepItem}>
                <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={14} />
                <span>Grafik interaktif menampilkan pergerakan fluktuasi porsi penjualan harian buah di Varisha Jus.</span>
              </li>
              <li style={styles.stepItem}>
                <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={14} />
                <span>Kurva didasarkan pada pembelajaran data histori penjualan runtut waktu (*time-series*) selama 7 hari ke belakang.</span>
              </li>
            </ul>
          </div>

          {/* KARTU 3: AKSI BELANJA */}
          <div style={{ ...styles.card, borderLeftColor: '#f59e0b' }}>
            <div style={{ ...styles.iconWrapper, backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <FaShoppingBag size={20} />
            </div>
            <h4 style={styles.cardTitle}>Otomatisasi Manajemen Stok Barang</h4>
            <ul style={styles.stepList}>
              <li style={styles.stepItem}>
                <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={14} />
                <span>Sistem secara otomatis membandingkan sisa stok riil di database dengan target kebutuhan besok hasil perhitungan AI.</span>
              </li>
              <li style={styles.stepItem}>
                <FaCheckCircle className="text-success mt-1 flex-shrink-0" size={14} />
                <span><b>Tombol Beli Semua:</b> Memungkinkan penambahan kuantitas pasokan komoditas buah secara massal ke dalam database Firestore hanya dengan satu klik action.</span>
              </li>
            </ul>
          </div>

          {/* KARTU 4: CATATAN AKADEMIS FOR SIDANG */}
          <div style={{ ...styles.card, borderLeftColor: '#6366f1' }}>
            <div style={{ ...styles.iconWrapper, backgroundColor: '#e0e7ff', color: '#6366f1' }}>
              <FaInfoCircle size={20} />
            </div>
            <h4 style={styles.cardTitle}>Catatan Metrik Usability (SUS)</h4>
            <ul style={styles.stepList}>
              <li style={styles.stepItem}>
                <FaLightbulb className="text-warning mt-1 flex-shrink-0" size={14} />
                <span>Halaman ini diimplementasikan guna mereduksi beban kognitif pengguna awam berdasarkan umpan balik indikator **P10 (Kebutuhan Membiasakan Diri)** pada pengujian SUS.</span>
              </li>
            </ul>
            <div style={styles.badge}>
              🤖 Status Sistem: Terintegrasi dengan Firebase & Cloud Model API.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanduanFitur;