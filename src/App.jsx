import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Halaman-halaman
import Login from './pages/Login';
import Register from './pages/Register';
import Absensi from './pages/Absensi';
import Profile from './pages/Profile';
import KelolaKaryawan from './pages/KelolaKaryawan';
import EditKaryawan from './pages/EditKaryawan'; 
import TambahKaryawan from './pages/TambahKaryawan'; 
import KelolaProduk from './pages/KelolaProduk';
import TambahProduk from './pages/TambahProduk';
import EditProduk from './pages/EditProduk';
import Transaksi from './pages/Transaksi';
import Keranjang from './pages/Keranjang';
import Pembayaran from './pages/Pembayaran';
import Tunai from './pages/Tunai';
import TransaksiSukses from './pages/TransaksiSukses';
import RekapHarian from './pages/RekapHarian';
import RekapBulanan from './pages/RekapBulanan';
import RekapKas from './pages/RekapKas';
import DetailKas from './pages/DetailKas';
import PrediksiStok from './pages/PrediksiStok';
import StokOpname from './pages/StokOpname';

// --- PERBAIKAN: IMPORT HALAMAN PANDUAN FITUR ADAPTIF ---
import PanduanFitur from './pages/PanduanFitur';

// Komponen Pembantu: Memastikan layar kembali ke atas setiap pindah halaman
// Ini membantu pemicuan useEffect di halaman Transaksi agar lebih akurat
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Menjamin refresh posisi layar di setiap route */}
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Core Routes */}
        <Route path="/absensi" element={<Absensi />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Manajemen Karyawan */}
        <Route path="/kelola-karyawan" element={<KelolaKaryawan />} />
        <Route path="/tambah-karyawan" element={<TambahKaryawan />} /> 
        <Route path="/kelola-karyawan/edit/:id" element={<EditKaryawan />} />

        {/* Manajemen Produk */}
        <Route path="/kelola-produk" element={<KelolaProduk />} />
        <Route path="/tambah-produk" element={<TambahProduk />} />
        <Route path="/kelola-produk/edit/:id" element={<EditProduk />} />

        {/* Stok & Prediksi */}
        <Route path="/stok-opname" element={<StokOpname />} />
        <Route path="/prediksi" element={<PrediksiStok />} />

        {/* --- PERBAIKAN: ROUTE KHUSUS MENU PANDUAN PEMELIHARAAN ADAPTIF --- */}
        <Route path="/panduan" element={<PanduanFitur />} />

        {/* Point of Sale (POS) System */}
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/keranjang" element={<Keranjang />} />
        <Route path="/pembayaran" element={<Pembayaran />} />
        <Route path="/tunai" element={<Tunai />} />
        <Route path="/transaksi-sukses" element={<TransaksiSukses />} />

        {/* Laporan & Rekap */}
        <Route path="/rekap-harian" element={<RekapHarian />} />
        <Route path="/rekap-bulanan" element={<RekapBulanan />} />
        <Route path="/rekap-kas" element={<RekapKas />} />
        <Route path="/detail-kas" element={<DetailKas />} />
      </Routes>
    </Router>
  );
}

export default App;