// src/pages/TambahProduk.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 
import { addProduct } from '../services/product_api';
import Sidebar from '../components/Sidebar'; // Menggunakan Sidebar komponen agar responsif terpusat
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const TambahProduk = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Makanan',
    harga: '',
    stok: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.nama || !formData.harga || !formData.stok) {
        alert("Semua data wajib diisi!");
        setLoading(false);
        return;
    }

    try {
      const dataToSend = {
          ...formData,
          harga: parseInt(formData.harga),
          stok: parseInt(formData.stok)
      };

      await addProduct(dataToSend);
      alert("Produk berhasil ditambahkan!");
      navigate('/kelola-produk'); 
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyimpan produk. Cek terminal backend untuk detail error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        <button className="btn btn-link text-secondary d-flex align-items-center gap-2 p-0 text-decoration-none mb-3 small" onClick={() => navigate('/kelola-produk')}>
            <FaArrowLeft /> Kembali ke Daftar
        </button>

        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px' }}>Tambah Produk Baru</h2>

        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    
                    {/* Nama Produk (Penuh 1 Baris) */}
                    <div className="col-12">
                        <label className="form-label fw-medium text-dark small mb-1">Nama Produk</label>
                        <input 
                            type="text" 
                            name="nama"
                            placeholder="Masukkan nama produk..." 
                            className="form-control bg-light py-2.5"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Kategori, Harga Jual, Stok (Grid Adaptif: 1 Kolom di HP, 3 Kolom di Laptop) */}
                    <div className="col-12 col-md-4">
                        <label className="form-label fw-medium text-dark small mb-1">Kategori</label>
                        <select 
                            name="kategori"
                            className="form-select bg-light py-2.5"
                            value={formData.kategori}
                            onChange={handleChange}
                        >
                            <option value="Makanan">Makanan</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Bahan Baku">Bahan Baku (Buah/Susu)</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-4">
                        <label className="form-label fw-medium text-dark small mb-1">Harga Jual (Rp)</label>
                        <input 
                            type="number" 
                            name="harga"
                            placeholder="Contoh: 15000" 
                            className="form-control bg-light py-2.5"
                            value={formData.harga}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <label className="form-label fw-medium text-dark small mb-1">Stok Awal</label>
                        <input 
                            type="number" 
                            name="stok"
                            placeholder="Contoh: 20" 
                            className="form-control bg-light py-2.5"
                            value={formData.stok}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4 border-top pt-4">
                    <button type="submit" className="btn btn-primary fw-bold px-4 py-2.5 w-100 w-sm-auto rounded-3 shadow-sm" disabled={loading}>
                        {loading ? "Menyimpan..." : <><FaSave className="me-2" /> Simpan Produk</>}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default TambahProduk;