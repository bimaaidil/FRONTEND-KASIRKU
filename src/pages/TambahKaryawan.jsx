// src/pages/TambahKaryawan.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../services/employee_api';
import Sidebar from '../components/Sidebar'; // Menggunakan Sidebar tunggal terpusat
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const TambahKaryawan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    posisi: 'Kasir',
    no_hp: '',
    alamat: '',
    status: 'AKTIF' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.no_hp) {
        alert("Nama dan No Handphone wajib diisi!");
        return;
    }

    setLoading(true);
    try {
      await addEmployee(formData);
      alert("Karyawan berhasil ditambahkan secara langsung!");
      navigate('/kelola-karyawan');
    } catch (error) {
      print("Error:", error);
      alert("Gagal menambahkan karyawan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        <button 
          className="btn btn-link text-secondary d-flex align-items-center gap-2 p-0 text-decoration-none mb-3 small" 
          onClick={() => navigate('/kelola-karyawan')}
        >
            <FaArrowLeft /> Kembali
        </button>
        
        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px' }}>Tambah Karyawan</h2>

        <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
            <form onSubmit={handleSubmit}>
              {/* Responsive Form Grid: 1 Kolom di HP, otomatis membelah 2 di layar PC laptop */}
              <div className="row g-3">
                  <div className="col-12">
                      <label className="form-label fw-medium text-dark small mb-1">Nama Lengkap</label>
                      <input type="text" name="nama" placeholder="Contoh: Budi Santoso" className="form-control bg-light py-2.5" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-6">
                      <label className="form-label fw-medium text-dark small mb-1">Posisi</label>
                      <select name="posisi" className="form-select bg-light py-2.5" onChange={handleChange} value={formData.posisi}>
                          <option value="Kasir">Kasir</option>
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                      </select>
                  </div>
                  <div className="col-12 col-md-6">
                      <label className="form-label fw-medium text-dark small mb-1">No Handphone</label>
                      <input type="text" name="no_hp" placeholder="Contoh: 0812XXXXXXXX" className="form-control bg-light py-2.5" onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                      <label className="form-label fw-medium text-dark small mb-1">Alamat Kantor/Rumah</label>
                      <input type="text" name="alamat" placeholder="Jl. Sudirman No. 12, Pekanbaru" className="form-control bg-light py-2.5" onChange={handleChange} />
                  </div>
              </div>
              
              <div className="d-flex justify-content-end mt-4 border-top pt-4">
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2.5 w-100 w-sm-auto rounded-3 shadow-sm" disabled={loading}>
                      {loading ? "Menyimpan..." : <><FaSave className="me-2" /> Simpan Karyawan</>}
                  </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default TambahKaryawan;