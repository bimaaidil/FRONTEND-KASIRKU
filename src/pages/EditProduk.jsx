// src/pages/EditProduk.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts, updateProduct } from '../services/product_api';
import Sidebar from '../components/Sidebar'; // Menggunakan Sidebar terpusat agar responsif
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const EditProduk = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Makanan',
    harga: '',
    stok: ''
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const allProducts = await getProducts();
        const found = allProducts.find(p => p.id === id);
        
        if (found) {
          setFormData({
            nama: found.nama,
            kategori: found.kategori,
            harga: found.harga,
            stok: found.stok
          });
        } else {
          alert("Produk tidak ditemukan!");
          navigate('/kelola-produk');
        }
      } catch (error) {
        console.error("Error ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = {
          ...formData,
          harga: parseInt(formData.harga),
          stok: parseInt(formData.stok)
      };

      await updateProduct(id, dataToSend);
      alert("Produk berhasil diperbarui!");
      navigate('/kelola-produk'); 
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengupdate produk.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        <button 
          className="btn btn-link text-secondary d-flex align-items-center gap-2 p-0 text-decoration-none mb-3 small" 
          onClick={() => navigate('/kelola-produk')}
        >
          <FaArrowLeft /> Kembali ke Daftar
        </button>

        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px' }}>Edit Produk</h2>

        <div className="card border-0 shadow-sm p-4 rounded-3">
          {loading ? (
            <div className="text-center py-3 text-secondary">Memuat data...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Form Grid Responsif: Atur grid row bootstrap agar rapi di gadget kecil */}
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-medium text-dark small">Nama Produk</label>
                  <input type="text" name="nama" className="form-control bg-light py-2.5" value={formData.nama} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-dark small">Kategori</label>
                  <select name="kategori" className="form-select bg-light py-2.5" value={formData.kategori} onChange={handleChange}>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Bahan Baku">Bahan Baku</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-dark small">Harga Jual (Rp)</label>
                  <input type="number" name="harga" className="form-control bg-light py-2.5" value={formData.harga} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium text-dark small">Stok</label>
                  <input type="number" name="stok" className="form-control bg-light py-2.5" value={formData.stok} onChange={handleChange} required />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary fw-medium px-4 py-2.5 w-100 w-sm-auto rounded-3" disabled={saving}>
                  {saving ? "Menyimpan..." : <><FaSave className="me-2" /> Simpan Perubahan</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProduk;