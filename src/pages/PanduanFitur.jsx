// src/pages/PanduanFitur.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  FaCalendarCheck, 
  FaChartLine, 
  FaShoppingBag, 
  FaFileInvoiceDollar, 
  FaArrowRight, 
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
    header: { marginBottom: '35px' },
    title: { fontSize: '26px', fontWeight: 'bold', color: '#154784', margin: 0 },
    subtitle: { fontSize: '14px', color: '#6b7280', marginTop: '4px', lineHeight: '1.5' },
    timeline: { display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', borderLeft: '5px solid #154784', position: 'relative' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
    stepBadge: { backgroundColor: '#154784', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
    iconWrapper: { backgroundColor: '#e0f2fe', color: '#154784', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    instructionList: { paddingLeft: '0', listStyleType: 'none', margin: 0 },
    instructionItem: { display: 'flex', gap: '10px', fontSize: '13.5px', color: '#4b5563', marginBottom: '12px', alignItems: 'flex-start', lineHeight: '1.6' },
    arrowIcon: { color: '#154784', marginTop: '5px', flexShrink: 0 },
    footerBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginTop: '25px', width: '100%', border: '1px solid #a7f3d0' }
  };

  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.mainContent}>
        {/* HEADER HALAMAN */}
        <div style={styles.header}>
          <h2 style={styles.title}>Alur & Tahapan Penggunaan Sistem Kasirku</h2>
          <p style={styles.subtitle}>
            Dokumentasi Terpadu Prosedur Kerja Operasional Penggunaan Aplikasi Secara Berurutan Pada Outlet Varisha Jus
          </p>
        </div>

        {/* TIMELINE TAHAPAN PENGGUNAAN */}
        <div style={styles.timeline}>
          
          {/* TAHAP 1: ABSENSI */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.stepBadge}>Tahap 01</span>
              <div style={styles.iconWrapper}><FaCalendarCheck size={18} /></div>
              <h4 style={styles.cardTitle}>Manajemen Absensi Awal Kerja Karyawan</h4>
            </div>
            <ul style={styles.instructionList}>
              <li style={styles.instructionItem}>
                <FaArrowRight style={styles.arrowIcon} size={12} />
                <span>Karyawan operasional wajib masuk ke menu <b>Absensi</b> sesaat setelah outlet dibuka untuk menginput data kehadiran (*clock-in*).</span>
              </li>
              <li style={styles.instructionItem}>
                <FaArrowRight style={styles.arrowIcon} size={12} />
                <span>Sistem mencatat jam masuk kerja riil secara otomatis ke dalam database untuk dipantau oleh Admin/Pemilik toko melalui panel monitoring.</span>
              </li>
            </ul>
          </div>

          {/* TAHAP 2: ANALISIS PREDIKSI */}
          <div style={{ ...styles.card, borderLeftColor: '#10b981' }}>
            <div style={styles.cardHeader}>
              <span style={{ ...styles.stepBadge, backgroundColor: '#10b981' }}>Tahap 02</span>
              <div style={{ ...styles.iconWrapper, backgroundColor: '#d1fae5', color: '#10b981' }}><FaChartLine size={18} /></div>
              <h4 style={styles.cardTitle}>Pemeriksaan Proyeksi Kebutuhan Stok AI</h4>
            </div>
            <ul style={styles.instructionList}>
              <li style={styles.instructionItem}>
                <FaArrowRight style={{ ...styles.arrowIcon, color: '#10b981' }} size={12} />
                <span>Akses menu <b>Fitur Cerdas &gt; Prediksi Stok</b> guna melihat komputasi hasil rekomendasi pasokan bahan baku buah untuk esok hari berbasis algoritma <b>Bi-LSTM</b>.</span>
              </li>
              <li style={styles.instructionItem}>
                <FaArrowRight style={{ ...styles.arrowIcon, color: '#10b981' }} size={12} />
                <span>Amati panel <b>Estimasi Cuaca & AI Insight</b> untuk menganalisis pengaruh fluktuasi cuaca harian Pekanbaru terhadap grafik tren perkiraan volume penjualan produk jus.</span>
              </li>
            </ul>
          </div>

          {/* TAHAP 3: EKSEKUSI BELANJA */}
          <div style={{ ...styles.card, borderLeftColor: '#f59e0b' }}>
            <div style={styles.cardHeader}>
              <span style={{ ...styles.stepBadge, backgroundColor: '#f59e0b' }}>Tahap 03</span>
              <div style={{ ...styles.iconWrapper, backgroundColor: '#fef3c7', color: '#f59e0b' }}><FaShoppingBag size={18} /></div>
              <h4 style={styles.cardTitle}>Otomatisasi Eksekusi Restok ke Database</h4>
            </div>
            <ul style={styles.instructionList}>
              <li style={styles.instructionItem}>
                <FaArrowRight style={{ ...styles.arrowIcon, color: '#f59e0b' }} size={12} />
                <span>Sistem secara otomatis mengalkulasi perbandingan antara sisa stok riil di gudang dengan target kebutuhan besok hasil hitungan model AI.</span>
              </li>
              <li style={styles.instructionItem}>
                <FaArrowRight style={{ ...styles.arrowIcon, color: '#f59e0b' }} size={12} />
                <span>Tekan tombol <b>Beli Semua Sesuai AI</b> untuk langsung menambahkan kuantitas pasokan komoditas buah utama serta bahan pelengkap secara massal ke dalam database <b>Cloud Firestore</b>.</span>
              </li>
            </ul>
          </div>

          {/* TAHAP 4: TRANSAKSI & LAPORAN */}
          <div style={{ ...styles.card, borderLeftColor: '#ef4444' }}>
            <div style={styles.cardHeader}>
              <span style={{ ...styles.stepBadge, backgroundColor: '#ef4444' }}>Tahap 04</span>
              <div style={{ ...styles.iconWrapper, backgroundColor: '#fee2e2', color: '#ef4444' }}><FaFileInvoiceDollar size={18} /></div>
              <h4 style={styles.cardTitle}>Pelayanan Transaksi Kasir & Rekapitulasi Akhir</h4>
            </div>
            <ul style={styles.instructionList}>
              <li style={styles.instructionItem}>
                <FaArrowRight style={{ ...styles.arrowIcon, color: '#ef4444' }} size={12} />
                <span>Gunakan menu <b>Transaksi</b> untuk melayani input pesanan pesanan menu pembeli. Sistem secara otomatis memotong stok barang riil terdaftar yang berada di database produk.</span>
              </li>
              <li style={styles.instructionItem}>
                <FaArrowRight style={{ ...styles.arrowIcon, color: '#ef4444' }} size={12} />
                <span>Di akhir jam operasional kerja outlet, buka kelompok menu <b>Laporan</b> (Rekap Harian, Bulanan, dan Kas) untuk memvalidasi pencatatan pembukuan finansial masuk secara transparan.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* PENANDA INTEGRASI DATA SISTEM */}
        <div style={styles.footerBadge}>
          <FaCheckCircle size={16} />
          <span>Seluruh rangkaian tahapan operasional di atas telah terintegrasi secara dinamis dengan Firebase Services dan API Model Bi-LSTM.</span>
        </div>

      </div>
    </div>
  );
};

export default PanduanFitur;