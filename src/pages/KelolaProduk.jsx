// src/pages/KelolaProduk.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 

// --- IMPORT API ---
import { getProducts, deleteProduct } from '../services/product_api';

// Icons
import { FaPlus, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import { Loader } from 'lucide-react';

const KelolaProduk = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]); 
      }
    } catch (error) {
      console.error("Error load produk:", error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus ${nama}?`)) {
      try {
        await deleteProduct(id);
        fetchProducts(); 
      } catch (error) {
        alert("Gagal menghapus produk");
      }
    }
  };

  const filteredProducts = Array.isArray(products) 
    ? products.filter(product => product.nama?.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />

      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        
        {/* HEADER PRODUCTS RESPONSIVE */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <h2 className="fw-bold text-dark m-0" style={{ fontSize: '24px' }}>Kelola Produk</h2>
          <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
            {/* Search Box */}
            <div className="d-flex align-items-center bg-white px-3 rounded-3 border w-100" style={{ maxWidth: window.innerWidth > 576 ? '250px' : '100%' }}>
                <FaSearch className="text-muted" />
                <input type="text" className="form-control border-0 bg-transparent shadow-none py-2" placeholder="Cari produk..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2 px-3 rounded-3 fw-medium text-nowrap" onClick={() => navigate('/tambah-produk')}>
                <FaPlus size={14} /> Tambah Produk
            </button>
          </div>
        </div>

        {/* TABLE COMPONENT CARD */}
        <div className="card border-0 shadow-sm p-4 rounded-3">
            {loading ? (
                <div className="text-center py-4 text-secondary">
                    <Loader className="animate-spin mb-2 mx-auto text-primary" /> 
                    Memuat Data Produk...
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-4 text-secondary">
                    Belum ada data produk. Silakan tambah produk baru.
                </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle text-nowrap m-0">
                    <thead>
                        <tr className="text-secondary small text-uppercase">
                            <th className="border-0 pb-3">No</th>
                            <th className="border-0 pb-3">Nama Produk</th>
                            <th className="border-0 pb-3">Kategori</th>
                            <th className="border-0 pb-3">Harga</th>
                            <th className="border-0 pb-3">Stok</th>
                            <th className="border-0 pb-3 text-center" style={{ width: '160px' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((item, index) => (
                            <tr key={item.id} className="border-top">
                                <td className="py-3 text-muted">{index + 1}</td>
                                <td className="py-3 fw-medium text-dark">{item.nama}</td>
                                <td className="py-3">
                                    <span className="badge bg-primary-subtle text-primary fw-semibold px-2.5 py-1.5 rounded">
                                        {item.kategori}
                                    </span>
                                </td>
                                <td className="py-3 fw-medium text-dark">Rp {item.harga ? parseInt(item.harga).toLocaleString('id-ID') : 0}</td>
                                <td className="py-3 text-dark font-monospace">{item.stok}</td>
                                <td className="py-3">
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button className="btn btn-light btn-sm border d-inline-flex align-items-center gap-1 py-1.5 fw-medium text-secondary" onClick={() => navigate(`/kelola-produk/edit/${item.id}`)}>
                                            <FaEdit size={12} /> Edit
                                        </button>
                                        <button className="btn btn-danger-subtle text-danger btn-sm d-inline-flex align-items-center gap-1 py-1.5 fw-medium" onClick={() => handleDelete(item.id, item.nama)}>
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

export default KelolaProduk;