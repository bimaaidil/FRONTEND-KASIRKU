// src/pages/EditKaryawan.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployees, updateEmployee } from '../services/employee_api';
import Sidebar from '../components/Sidebar'; // Menggunakan Sidebar terpusat agar responsif
import { FaSave, FaArrowLeft } from 'react-icons/fa';

const EditKaryawan = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    posisi: 'Kasir',
    no_hp: '',
    alamat: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allEmployees = await getEmployees();
        const found = allEmployees.find(emp => emp.id === id);
        
        if (found) {
          setFormData({
            nama: found.nama,
            posisi: found.posisi,
            no_hp: found.no_hp,
            alamat: found.alamat || ''
          });
        } else {
          alert("Karyawan tidak ditemukan!");
          navigate('/kelola-karyawan');
        }
      } catch (error) {
        console.error("Error load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateEmployee(id, formData);
      alert("Data karyawan berhasil diperbarui!");
      navigate('/kelola-karyawan');
    } catch (error) {
      alert("Gagal mengupdate data karyawan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      {/* Main Content dengan penyesuaian margin dinamis */}
      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        <button 
          className="btn btn-link text-secondary d-flex align-items-center gap-2 p-0 text-decoration-none mb-3 small" 
          onClick={() => navigate('/kelola-karyawan')}
        >
          <FaArrowLeft /> Kembali ke Daftar
        </button>

        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '24px' }}>Edit Karyawan</h2>

        <div className="card border-0 shadow-sm p-4 rounded-3">
          {loading ? (
            <div className="text-center py-3 text-secondary">Memuat data...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Form Grid Responsif: 1 kolom di HP, 2 kolom di Laptop */}
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-medium text-dark small">Nama Lengkap</label>
                  <input type="text" name="nama" className="form-control bg-light py-2.5" value={formData.nama} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-medium text-dark small">Posisi</label>
                  <select name="posisi" className="form-select bg-light py-2.5" value={formData.posisi} onChange={handleChange}>
                    <option value="Kasir">Kasir</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-medium text-dark small">No Handphone</label>
                  <input type="text" name="no_hp" className="form-control bg-light py-2.5" value={formData.no_hp} onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium text-dark small">Alamat</label>
                  <input type="text" name="alamat" className="form-control bg-light py-2.5" value={formData.alamat} onChange={handleChange} />
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

export default EditKaryawan;