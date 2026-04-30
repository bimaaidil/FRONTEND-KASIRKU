// src/pages/KelolaProduk.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // <--- IMPORT SIDEBAR TUNGGAL

// --- IMPORT API ---
import { getProducts, deleteProduct } from '../services/product_api';

// Icon khusus konten halaman
import { FaPlus, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import { Loader } from 'lucide-react';

const KelolaProduk = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- FUNGSI AMBIL DATA DARI BACKEND ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error load produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- FUNGSI HAPUS PRODUK ---
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

  // Filter Pencarian
  const filteredProducts = products.filter(product =>
    product.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Styles (Sudah dibersihkan dari Sidebar)
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 40px', backgroundColor: '#F5F6FA' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' },
    tableHeader: { textAlign: 'left', padding: '16px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f3f4f6' },
    tableCell: { padding: '16px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f9fafb' },
    btnAction: { border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }
  };

  return (
    <div style={styles.container}>
      {/* 1. PANGGIL SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>Kelola Produk</h2>
          <div style={{display: 'flex', gap: '15px'}}>
            {/* Search Bar */}
            <div style={{display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '0 15px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '250px'}}>
                <FaSearch color="#9ca3af" />
                <input 
                    type="text" 
                    placeholder="Cari produk..." 
                    style={{border: 'none', outline: 'none', padding: '10px', width: '100%'}}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {/* Tombol Tambah */}
            <button 
                onClick={() => navigate('/tambah-produk')}
                style={{backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500'}}
            >
                <FaPlus size={14} /> Tambah Produk
            </button>
          </div>
        </div>

        {/* TABLE CARD */}
        <div style={styles.card}>
            {loading ? (
                <div style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}>
                    <Loader className="animate-spin" style={{margin: '0 auto 10px'}} /> 
                    Memuat Data Produk...
                </div>
            ) : filteredProducts.length === 0 ? (
                <div style={{padding: '40px', textAlign: 'center', color: '#6b7280'}}>
                    Belum ada data produk. Silakan tambah produk baru.
                </div>
            ) : (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>No</th>
                            <th style={styles.tableHeader}>Nama Produk</th>
                            <th style={styles.tableHeader}>Kategori</th>
                            <th style={styles.tableHeader}>Harga</th>
                            <th style={styles.tableHeader}>Stok</th>
                            <th style={styles.tableHeader}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((item, index) => (
                            <tr key={item.id} style={{borderBottom: '1px solid #f9fafb'}}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={{...styles.tableCell, fontWeight: '500'}}>{item.nama}</td>
                                <td style={styles.tableCell}>
                                    <span style={{backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>
                                        {item.kategori}
                                    </span>
                                </td>
                                <td style={styles.tableCell}>Rp {parseInt(item.harga).toLocaleString('id-ID')}</td>
                                <td style={styles.tableCell}>{item.stok}</td>
                                <td style={styles.tableCell}>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <button 
                                            onClick={() => navigate(`/kelola-produk/edit/${item.id}`)}
                                            style={{...styles.btnAction, backgroundColor: '#f3f4f6', color: '#4b5563'}}
                                        >
                                            <FaEdit size={12} /> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id, item.nama)}
                                            style={{...styles.btnAction, backgroundColor: '#fee2e2', color: '#dc2626'}}
                                        >
                                            <FaTrash size={12} /> Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};

export default KelolaProduk;