// src/pages/KelolaKaryawan.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Import API
import { getEmployees, deleteEmployee, updateEmployeeStatus } from '../services/employee_api'; 

// Icons
import { FaPlus, FaTrash, FaEdit, FaSearch, FaUserTie, FaCheckCircle } from 'react-icons/fa';
import { Loader } from 'lucide-react';

const KelolaKaryawan = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole !== 'Admin') {
      alert("Akses Ditolak! Halaman ini hanya untuk Pemilik.");
      navigate('/absensi');
    }
  }, [userRole, navigate]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      
      if (Array.isArray(data)) {
        setEmployees(data);
      } else if (data && Array.isArray(data.data)) {
        setEmployees(data.data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Gagal ambil data karyawan:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleVerify = async (id, nama) => {
    if (window.confirm(`Aktifkan akun karyawan ${nama}?`)) {
      try {
        await updateEmployeeStatus(id, 'AKTIF');
        alert(`Karyawan ${nama} berhasil diverifikasi!`);
        fetchEmployees(); 
      } catch (error) {
        alert("Gagal memverifikasi data.");
      }
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Hapus karyawan ${nama}?`)) {
      try {
        await deleteEmployee(id);
        fetchEmployees(); 
      } catch (error) {
        alert("Gagal menghapus data.");
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        
        {/* HEADER MANAGEMENT RESPONSIVE */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <h2 className="fw-bold text-dark m-0" style={{ fontSize: '24px' }}>Data Karyawan</h2>
          <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
            {/* Search container */}
            <div className="d-flex align-items-center bg-white px-3 rounded-3 border w-100" style={{ maxWidth: window.innerWidth > 576 ? '250px' : '100%' }}>
                <FaSearch className="text-muted" />
                <input type="text" className="form-control border-0 bg-transparent shadow-none py-2" placeholder="Cari karyawan..." onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded-3 fw-medium text-nowrap" onClick={() => navigate('/tambah-karyawan')}>
                <FaPlus size={14} /> Tambah Karyawan
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="card border-0 shadow-sm p-4 rounded-3">
            {loading ? (
                <div className="text-center py-4 text-secondary"><Loader className="animate-spin mb-2 mx-auto" /> Memuat Data Karyawan...</div>
            ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-4 text-secondary">Tidak ada data karyawan yang ditemukan.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle text-nowrap m-0">
                    <thead>
                        <tr className="text-secondary small text-uppercase">
                            <th className="border-0 pb-3">Nama Lengkap</th>
                            <th className="border-0 pb-3">Posisi</th>
                            <th className="border-0 pb-3">No Telepon</th>
                            <th className="border-0 pb-3">Status</th>
                            <th className="border-0 pb-3 text-center" style={{ width: '220px' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.id} className="border-top">
                                <td className="py-3 fw-medium text-dark">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px', backgroundColor: emp.status === 'AKTIF' ? '#e0e7ff' : '#f3f4f6', color: emp.status === 'AKTIF' ? '#3730a3' : '#9ca3af' }}>
                                            <FaUserTie size={14} />
                                        </div>
                                        <span>{emp.nama}</span>
                                    </div>
                                </td>
                                <td className="py-3 text-secondary">{emp.posisi}</td>
                                <td className="py-3 text-secondary">{emp.no_hp}</td>
                                <td className="py-3">
                                    <span className={`badge px-2.5 py-1.5 rounded text-uppercase fw-semibold ${emp.status === 'AKTIF' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`} style={{ fontSize: '11px' }}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="d-flex gap-2 justify-content-center">
                                        {emp.status !== 'AKTIF' && (
                                            <button className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1 py-1.5 fw-medium" onClick={() => handleVerify(emp.id, emp.nama)}>
                                                <FaCheckCircle size={12} /> Verif
                                            </button>
                                        )}
                                        <button className="btn btn-light btn-sm border d-inline-flex align-items-center gap-1 py-1.5 fw-medium text-secondary" onClick={() => navigate(`/kelola-karyawan/edit/${emp.id}`)}>
                                            <FaEdit size={12} /> Edit
                                        </button>
                                        <button className="btn btn-danger-subtle text-danger btn-sm d-inline-flex align-items-center gap-1 py-1.5 fw-medium" onClick={() => handleDelete(emp.id, emp.nama)}>
                                            <FaTrash size={12} /> Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default KelolaKaryawan;