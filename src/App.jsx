// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// --- 1. IMPORT HALAMAN PREDIKSI (BARU) ---
import PrediksiStok from './pages/PrediksiStok';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/absensi" element={<Absensi />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/kelola-karyawan" element={<KelolaKaryawan />} />
        <Route path="/tambah-karyawan" element={<TambahKaryawan />} /> 
        <Route path="/kelola-karyawan/edit/:id" element={<EditKaryawan />} />

        <Route path="/kelola-produk" element={<KelolaProduk />} />
        <Route path="/tambah-produk" element={<TambahProduk />} />
        <Route path="/kelola-produk/edit/:id" element={<EditProduk />} />

        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/keranjang" element={<Keranjang />} />
        <Route path="/pembayaran" element={<Pembayaran />} />
        <Route path="/tunai" element={<Tunai />} />
        <Route path="/transaksi-sukses" element={<TransaksiSukses />} />

        <Route path="/rekap-harian" element={<RekapHarian />} />
        <Route path="/rekap-bulanan" element={<RekapBulanan />} />
        <Route path="/rekap-kas" element={<RekapKas />} />
        <Route path="/detail-kas" element={<DetailKas />} />

        {/* --- 2. ROUTE HALAMAN PREDIKSI (BARU) --- */}
        {/* Pastikan link di Sidebar mengarah ke "/prediksi" */}
        <Route path="/prediksi" element={<PrediksiStok />} />

      </Routes>
    </Router>
  );
}

export default App;