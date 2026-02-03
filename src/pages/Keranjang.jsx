// src/pages/Keranjang.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Keranjang = () => {
  const navigate = useNavigate();
  
  // --- STATE CART ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartData');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // State untuk Item yang sedang diedit (Popup Edit Produk)
  const [editingItem, setEditingItem] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [editDesc, setEditDesc] = useState('');

  // State untuk Popup Simpan Pesanan
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  // --- EFFECT ---
  useEffect(() => {
    localStorage.setItem('cartData', JSON.stringify(cart));
  }, [cart]);

  // --- LOGIKA UTAMA ---
  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // --- HANDLERS ---
  const handleRowClick = (item) => {
    setEditingItem(item);
    setEditQty(item.qty);
    setEditDesc(item.description || '');
  };

  const handleSaveChanges = () => {
    const updatedCart = cart.map(item => 
        item.id === editingItem.id ? { ...item, qty: editQty, description: editDesc } : item
    );
    setCart(updatedCart);
    setEditingItem(null);
  };

  const handleDeleteItem = () => {
    const updatedCart = cart.filter(item => item.id !== editingItem.id);
    setCart(updatedCart);
    setEditingItem(null);
  };

  // Handler Tombol Simpan (Membuka Popup)
  const handleOpenSaveModal = () => {
    setShowSaveModal(true);
  };

  // Handler Konfirmasi Simpan
  const handleConfirmSave = () => {
    // Logika simpan ke database bisa ditaruh disini
    alert(`Pesanan disimpan dengan catatan: ${orderNote}`);
    setShowSaveModal(false);
    setCart([]); // Kosongkan keranjang setelah simpan (Opsional)
    navigate('/transaksi'); // Kembali ke menu
  };

  // Handler Tombol Bayar (Pindah Halaman)
  const handlePayClick = () => {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }
    navigate('/pembayaran');
  };

  // --- STYLES ---
  const styles = {
    container: { minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    headerBar: { backgroundColor: '#154784', padding: '15px 30px', color: 'white', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '18px', fontWeight: '600' },
    backButton: { background: 'transparent', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    content: { padding: '40px 60px', maxWidth: '1200px', margin: '0 auto' },
    
    // Tabel
    tableContainer: { border: '1px solid #ddd', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: 'white', marginBottom: '30px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'center', padding: '15px', borderBottom: '2px solid #ddd', fontWeight: 'bold', color: '#333' },
    td: { textAlign: 'center', padding: '15px', borderBottom: '1px solid #eee', color: '#333', fontWeight: '500' },
    tr: { cursor: 'pointer', transition: 'background 0.2s' },

    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
    totalText: { fontSize: '16px', fontWeight: 'bold', color: 'black' },
    totalPriceText: { fontSize: '16px', fontWeight: 'bold', color: 'black' },
    btnContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '20px' },
    btnAction: { backgroundColor: '#154784', color: 'white', border: 'none', padding: '15px 0', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '45%', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' },

    // Overlay Popup
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    
    // Popup Edit Item
    popupCard: { backgroundColor: 'white', width: '500px', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative' },
    popupHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    productTitleBox: { border: '1px solid #ddd', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold', minWidth: '150px' },
    closeBtn: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#555' },
    infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px', fontWeight: '600' },
    qtySection: { marginTop: '20px', marginBottom: '20px' },
    qtyLabel: { fontWeight: 'bold', fontSize: '14px', marginBottom: '10px', display: 'block' },
    qtyControl: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100px' },
    qtyBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    descSection: { marginBottom: '20px' },
    descInput: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none' },
    deleteBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', margin: '0 auto 20px auto' },
    saveBtnPopup: { width: '100%', backgroundColor: '#154784', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },

    // Popup Simpan Pesanan (NEW STYLE)
    saveModalCard: { backgroundColor: 'white', width: '400px', borderRadius: '10px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', textAlign: 'center' },
    saveModalTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    saveInputLabel: { display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textAlign: 'left', color: '#333' },
    saveInput: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px', marginBottom: '5px', outline: 'none' },
    charCount: { fontSize: '11px', color: '#888', textAlign: 'right', marginBottom: '20px' },
    saveConfirmBtn: { width: '100%', backgroundColor: '#154784', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
        {/* Header Biru */}
        <div style={styles.headerBar}>
            <button style={styles.backButton} onClick={() => navigate('/transaksi')}>
                <FaArrowLeft /> Menu
            </button>
        </div>

        {/* Konten Utama */}
        <div style={styles.content}>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>No</th>
                            <th style={styles.th}>Produk</th>
                            <th style={styles.th}>Jumlah Beli</th>
                            <th style={styles.th}>Harga</th>
                            <th style={styles.th}>Sub Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length > 0 ? cart.map((item, index) => (
                            <tr key={item.id} style={styles.tr} onClick={() => handleRowClick(item)} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{item.name}</td>
                                <td style={styles.td}>{item.qty}</td>
                                <td style={styles.td}>{formatRupiah(item.price)}</td>
                                <td style={styles.td}>{formatRupiah(item.price * item.qty)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{...styles.td, color: '#888', padding: '30px'}}>Keranjang masih kosong.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={styles.footer}>
                <div style={styles.totalText}>Total ({totalItems})</div>
                <div style={styles.totalPriceText}>{formatRupiah(totalPrice)}</div>
            </div>

            <div style={styles.btnContainer}>
                <button style={styles.btnAction} onClick={handleOpenSaveModal}>Simpan</button>
                <button style={styles.btnAction} onClick={handlePayClick}>Bayar</button>
            </div>
        </div>

        {/* === POPUP EDIT ITEM === */}
        {editingItem && (
            <div style={styles.overlay}>
                <div style={styles.popupCard}>
                    <div style={styles.popupHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button style={styles.closeBtn} onClick={() => setEditingItem(null)}><FaTimes /></button>
                            <div style={styles.productTitleBox}>{editingItem.name}</div>
                        </div>
                    </div>
                    <div style={styles.infoRow}><span>Harga</span><span>{formatRupiah(editingItem.price)}</span></div>
                    <div style={{ ...styles.infoRow, borderBottom: '2px solid #eee' }}><span>Total</span><span>{formatRupiah(editingItem.price * editQty)}</span></div>
                    <div style={styles.qtySection}>
                        <span style={styles.qtyLabel}>Jumlah Produk</span>
                        <div style={styles.qtyControl}>
                            <button style={styles.qtyBtn} onClick={() => setEditQty(q => Math.max(1, q - 1))}><FaMinus size={12} /></button>
                            <span>{editQty}</span>
                            <button style={styles.qtyBtn} onClick={() => setEditQty(q => q + 1)}><FaPlus size={12} /></button>
                        </div>
                    </div>
                    <div style={styles.descSection}>
                        <span style={styles.qtyLabel}>Deskripsi (Opsional)</span>
                        <input type="text" style={styles.descInput} placeholder="Deskripsi (Opsional)" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                    </div>
                    <button style={styles.deleteBtn} onClick={handleDeleteItem}><FaTrash /> Hapus dari Keranjang</button>
                    <button style={styles.saveBtnPopup} onClick={handleSaveChanges}>Simpan</button>
                </div>
            </div>
        )}

        {/* === POPUP SIMPAN PESANAN (New Feature) === */}
        {showSaveModal && (
            <div style={styles.overlay}>
                <div style={styles.saveModalCard}>
                    <div style={styles.saveModalTitle}>
                        Simpan Pesanan
                        <FaTimes style={{ cursor: 'pointer', fontSize: '16px', color: '#555' }} onClick={() => setShowSaveModal(false)} />
                    </div>
                    
                    <label style={styles.saveInputLabel}>Tambahkan Keterangan Untuk Menyimpan Pesanan</label>
                    <input 
                        type="text" 
                        style={styles.saveInput} 
                        placeholder="Keterangan" 
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        maxLength={100}
                    />
                    <div style={styles.charCount}>{orderNote.length}/100</div>

                    <button style={styles.saveConfirmBtn} onClick={handleConfirmSave}>
                        Simpan dan Cetak Pesanan
                    </button>
                </div>
            </div>
        )}

    </div>
  );
};

export default Keranjang;