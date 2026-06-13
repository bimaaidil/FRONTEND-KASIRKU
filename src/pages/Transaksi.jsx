import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db } from '../config/firebase';
import { 
  collection, addDoc, serverTimestamp, query, where, 
  getDocs, limit, orderBy, doc, updateDoc 
} from 'firebase/firestore';

// --- IMPORT GAMBAR ---
import apelImg from '../assets/Apel.png';
import belimbingImg from '../assets/Belimbing.png';
import jagungImg from '../assets/Jagung.jpg';
import jambuImg from '../assets/Jambu.jpg';
import jerukImg from '../assets/Jeruk.jpg';
import manggaImg from '../assets/Mangga.jpg';
import melonImg from '../assets/Melon.jpg';
import nagaImg from '../assets/Naga.jpg';
import nanasImg from '../assets/Nanas.jpg';
import pokatImg from '../assets/Pokat.jpg';
import semangkaImg from '../assets/Semangka.jpg';
import sirsakImg from '../assets/Sirsak.jpg';
import terongBelandaImg from '../assets/Terong Belanda.jpg';
import timunImg from '../assets/Timun.jpg';
import icVanillaImg from '../assets/IC Vanilla.jpg';
import icCokelatImg from '../assets/IC Cokelat.jpg';
import icMixImg from '../assets/IC Mix.jpg';

import { FaChevronDown, FaShoppingCart, FaStore, FaDoorClosed, FaMoneyBillWave, FaClipboardList, FaTimes, FaMinus, FaPlus } from 'react-icons/fa';

const Transaksi = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || "Petugas";

  // --- STATE SHIFT/KASIR ---
  const [isKasirOpen, setIsKasirOpen] = useState(false);
  const [currentShiftData, setCurrentShiftData] = useState(null);
  const [modalAwal, setModalAwal] = useState('');
  const [loadingShift, setLoadingShift] = useState(true);

  // --- STATE TRANSAKSI ---
  const [selectedCategory, setSelectedCategory] = useState('Juice'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSavedOrders, setShowSavedOrders] = useState(false);
  const [savedOrders, setSavedOrders] = useState([]);

  // --- REVISI: STATE KUSTOMISASI RESEP & QUANTITY ---
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [gulaOption, setGulaOption] = useState('normal'); 
  const [susuOption, setSusuOption] = useState('pakai');  
  const [customQty, setCustomQty] = useState(1); // State baru untuk batch input

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartData');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const checkKasirStatus = useCallback(async () => {
    setLoadingShift(true);
    try {
      const q = query(
        collection(db, "shift_logs"),
        where("status", "==", "OPEN"),
        orderBy("waktu_buka", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setIsKasirOpen(true);
        setCurrentShiftData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setIsKasirOpen(false);
        setCurrentShiftData(null);
      }
    } catch (error) {
      console.error("Error checking kasir status:", error);
    } finally {
      setLoadingShift(false);
    }
  }, []);

  useEffect(() => {
    checkKasirStatus();
    const storedOrders = JSON.parse(localStorage.getItem('savedOrders')) || [];
    setSavedOrders(storedOrders);
    
    const savedCart = localStorage.getItem('cartData');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, [checkKasirStatus]);

  useEffect(() => {
    localStorage.setItem('cartData', JSON.stringify(cart));
  }, [cart]);

  const handleBukaKasir = async () => {
    if (!modalAwal || parseFloat(modalAwal) < 0) {
      return alert("Masukkan nominal modal awal yang valid!");
    }
    setLoadingShift(true); 
    try {
      await addDoc(collection(db, "shift_logs"), {
        petugas_buka: userName,
        modal_awal: parseFloat(modalAwal),
        status: "OPEN",
        waktu_buka: serverTimestamp() 
      });
      setTimeout(() => checkKasirStatus(), 500);
      alert(`Kasir berhasil dibuka!`);
    } catch (error) {
      alert("Gagal membuka kasir.");
    } finally {
      setLoadingShift(false);
    }
  };

  const handleTutupKasir = async () => {
    if (!window.confirm("Yakin ingin menutup kasir?")) return;
    setLoadingShift(true); 
    try {
      const q = query(collection(db, "transactions"), where("waktu", ">=", currentShiftData.waktu_buka));
      const querySnapshot = await getDocs(q);
      let totalPendapatan = 0;
      querySnapshot.forEach((doc) => { totalPendapatan += doc.data().total_harga || 0; });

      const shiftRef = doc(db, "shift_logs", currentShiftData.id);
      await updateDoc(shiftRef, {
        waktu_tutup: serverTimestamp(),
        status: "CLOSED",
        total_pendapatan: totalPendapatan,
        petugas_tutup: userName,
        total_uang_di_kasir: totalPendapatan + currentShiftData.modal_awal
      });

      setIsKasirOpen(false);
      localStorage.removeItem('cartData');
      alert("Kasir Berhasil Ditutup.");
      window.location.reload();
    } catch (error) { alert("Gagal menutup kasir."); } finally { setLoadingShift(false); }
  };

  const handleProductClick = (product) => {
    if (!isKasirOpen) return;
    
    if (product.category === 'Ice Cream') {
      executeAddToCart(product, { gula: 'normal', susu: 'pakai' }, 1);
    } else {
      setSelectedProduct(product);
      setGulaOption('normal');
      setSusuOption('pakai');
      setCustomQty(1); // Reset jumlah porsi jadi 1 setiap klik baru
      setShowCustomModal(true);
    }
  };

  const executeAddToCart = (product, options, quantity) => {
    const cartItemId = `${product.id}_g_${options.gula}_s_${options.susu}`;
    
    const existingItem = cart.find(item => item.cartItemId === cartItemId);
    if (existingItem) {
      setCart(cart.map(item => item.cartItemId === cartItemId ? { ...item, qty: item.qty + quantity } : item));
    } else {
      setCart([...cart, { ...product, cartItemId, qty: quantity, options }]);
    }
    setShowCustomModal(false);
  };

  const handleGoToCart = () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    localStorage.setItem('cartData', JSON.stringify(cart));
    navigate('/keranjang');
  };

  const handleLoadOrder = (order) => {
    if (cart.length > 0 && !window.confirm("Ganti keranjang saat ini dengan pesanan yang dipilih?")) return;
    setCart(order.items);
    const updatedSaved = savedOrders.filter(o => o.id !== order.id);
    setSavedOrders(updatedSaved);
    localStorage.setItem('savedOrders', JSON.stringify(updatedSaved));
    setShowSavedOrders(false);
    navigate('/keranjang');
  };

  const products = [
    { id: 1, name: 'Apel', category: 'Juice', price: 9000, image: apelImg },
    { id: 2, name: 'Belimbing', category: 'Juice', price: 9000, image: belimbingImg },
    { id: 3, name: 'Jagung', category: 'Juice', price: 9000, image: jagungImg },
    { id: 4, name: 'Jeruk', category: 'Juice', price: 9000, image: jerukImg },
    { id: 5, name: 'Jambu', category: 'Juice', price: 9000, image: jambuImg },
    { id: 6, name: 'Mangga', category: 'Juice', price: 9000, image: manggaImg },
    { id: 7, name: 'Melon', category: 'Juice', price: 9000, image: melonImg },
    { id: 8, name: 'Naga', category: 'Juice', price: 9000, image: nagaImg },
    { id: 9, name: 'Nenas', category: 'Juice', price: 9000, image: nanasImg },
    { id: 10, name: 'Pokat', category: 'Juice', price: 9000, image: pokatImg },
    { id: 11, name: 'Semangka', category: 'Juice', price: 9000, image: semangkaImg },
    { id: 12, name: 'Sirsak', category: 'Juice', price: 9000, image: sirsakImg },
    { id: 13, name: 'Terong Belanda', category: 'Juice', price: 9000, image: terongBelandaImg },
    { id: 14, name: 'Timun', category: 'Juice', price: 9000, image: timunImg },
    { id: 101, name: 'Apel Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: apelImg },
    { id: 102, name: 'Belimbing Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: belimbingImg },
    { id: 103, name: 'Jagung Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: jagungImg },
    { id: 104, name: 'Jeruk Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: jerukImg },
    { id: 105, name: 'Jambu Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: jambuImg },
    { id: 106, name: 'Mangga Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: manggaImg },
    { id: 107, name: 'Melon Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: melonImg },
    { id: 108, name: 'Naga Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: nagaImg },
    { id: 109, name: 'Nenas Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: nanasImg },
    { id: 110, name: 'Pokat Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: pokatImg },
    { id: 111, name: 'Semangka Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: semangkaImg },
    { id: 112, name: 'Sirsak Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: sirsakImg },
    { id: 113, name: 'Terong Bld Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: terongBelandaImg },
    { id: 114, name: 'Timun Ice Cream', category: 'Juice + Ice Cream', price: 12000, image: timunImg },
    { id: 201, name: 'Vanilla Ice Cream 9', category: 'Ice Cream', price: 9000, image: icVanillaImg },
    { id: 202, name: 'Cokelat Ice Cream 9', category: 'Ice Cream', price: 9000, image: icCokelatImg },
    { id: 205, name: 'Vanilla Ice Cream 12', category: 'Ice Cream', price: 12000, image: icVanillaImg },
    { id: 209, name: 'Vanilla Ice Cream 15', category: 'Ice Cream', price: 15000, image: icVanillaImg },
    { id: 212, name: 'Mix Ice Cream 15', category: 'Ice Cream', price: 15000, image: icMixImg },
  ];

  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 50px', backgroundColor: 'white', position: 'relative' },
    shiftBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px 25px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #edf2f7' },
    statusInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    shiftActions: { display: 'flex', gap: '12px', alignItems: 'center' },
    openBtn: { backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    closeBtn: { backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
    savedOrdersBtn: { backgroundColor: '#154784', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', fontSize: '14px' },
    badge: { backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold' },
    menuButton: { backgroundColor: '#154784', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', cursor: isKasirOpen ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '8px', opacity: isKasirOpen ? 1 : 0.6 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '40px 25px', marginTop: '30px', opacity: isKasirOpen ? 1 : 0.3, pointerEvents: isKasirOpen ? 'auto' : 'none' },
    imageCircle: { width: '130px', height: '130px', borderRadius: '50%', backgroundColor: '#f9fafb', marginBottom: '12px', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    bottomBar: { position: 'fixed', bottom: '30px', left: 'calc(50% + 130px)', transform: 'translateX(-50%)', backgroundColor: '#154784', color: 'white', padding: '18px 60px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', minWidth: '350px', fontWeight: 'bold', zIndex: 100 },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', width: '400px', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
    radioGroup: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' },
    submitCustomBtn: { backgroundColor: '#154784', color: 'white', border: 'none', width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
    
    // STYLE BARU UNTUK INPUT QUANTITY DI MODAL
    qtyContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', margin: '15px 0' },
    qtyBtn: { border: '1px solid #ddd', padding: '8px', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#f9fafb' }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        
        <div style={styles.shiftBar}>
          <div style={styles.statusInfo}>
            <h4 style={{ margin: 0, color: '#154784' }}>Status Kasir</h4>
            <span style={{ fontSize: '13px', color: isKasirOpen ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>
              {isKasirOpen ? `● OPEN (Shift ${currentShiftData?.petugas_buka})` : "● CLOSED"}
            </span>
          </div>

          <div style={styles.shiftActions}>
            {savedOrders.length > 0 && isKasirOpen && (
              <button style={styles.savedOrdersBtn} onClick={() => setShowSavedOrders(true)}>
                <FaClipboardList /> 
                <span>Pesanan Tersimpan</span>
                <span style={styles.badge}>{savedOrders.length}</span>
              </button>
            )}

            {isKasirOpen ? (
              <button style={styles.closeBtn} onClick={handleTutupKasir} disabled={loadingShift}>
                <FaDoorClosed /> {loadingShift ? '...' : 'Tutup Kasir'}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <FaMoneyBillWave style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
                  <input 
                    type="number" 
                    placeholder="Modal Awal" 
                    value={modalAwal}
                    onChange={(e) => setModalAwal(e.target.value)}
                    style={{ padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #ddd', width: '130px' }}
                  />
                </div>
                <button style={styles.openBtn} onClick={handleBukaKasir} disabled={loadingShift}>
                  {loadingShift ? '...' : 'Buka Kasir'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
            <button style={styles.menuButton} onClick={() => isKasirOpen && setIsDropdownOpen(!isDropdownOpen)}>
                {selectedCategory} <FaChevronDown size={10} />
            </button>
            {isDropdownOpen && (
                <div style={{ position: 'absolute', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', width: '180px', zIndex: 10 }}>
                    {['Juice', 'Juice + Ice Cream', 'Ice Cream'].map(cat => (
                        <div key={cat} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => { setSelectedCategory(cat); setIsDropdownOpen(false); }}>
                            {cat}
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div style={styles.grid}>
            {products.filter(p => p.category === selectedCategory).map((prod) => (
                <div key={prod.id} style={{ textAlign:'center', cursor:'pointer' }} onClick={() => handleProductClick(prod)}>
                    <div style={styles.imageCircle}>
                        <img src={prod.image} alt={prod.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                    <div style={{ fontWeight: '600' }}>{prod.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{formatRupiah(prod.price)}</div>
                </div>
            ))}
        </div>

        {totalItems > 0 && isKasirOpen && (
            <div style={styles.bottomBar} onClick={handleGoToCart}>
                <FaShoppingCart style={{ marginRight: '10px' }} />
                {totalItems} Item | Total: {formatRupiah(totalPrice)}
            </div>
        )}

        {!isKasirOpen && !loadingShift && (
          <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <FaStore size={60} style={{ color: '#ccc', marginBottom: '15px' }} />
            <h3 style={{ color: '#999' }}>Kasir belum dibuka.</h3>
          </div>
        )}

        {showSavedOrders && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Antrean Pesanan</h3>
                <FaTimes style={{ cursor: 'pointer', color: '#666' }} onClick={() => setShowSavedOrders(false)}/>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {savedOrders.map((order, index) => (
                  <div key={index} style={{ padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => handleLoadOrder(order)}>
                    <div style={{ fontWeight: 'bold', color: '#154784' }}>{order.note || "Tanpa Catatan"}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{order.items.length} Produk - {formatRupiah(order.total)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- REVISI: MODAL KUSTOMISASI DENGAN INPUT JUMLAH PORSI OPTIMAL --- */}
        {showCustomModal && selectedProduct && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>Kustomisasi {selectedProduct.name}</h3>
                <FaTimes style={{ cursor: 'pointer', color: '#666' }} onClick={() => setShowCustomModal(false)}/>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#154784', display: 'block', marginBottom: '8px' }}>Takaran Gula:</span>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input type="radio" name="gula" value="normal" checked={gulaOption === 'normal'} onChange={() => setGulaOption('normal')} />
                    Normal (2,5 / 3 Sendok)
                  </label>
                  <label style={styles.radioLabel}>
                    <input type="radio" name="gula" value="sedikit" checked={gulaOption === 'sedikit'} onChange={() => setGulaOption('sedikit')} />
                    Gula Sedikit (1 Sendok)
                  </label>
                  <label style={styles.radioLabel}>
                    <input type="radio" name="gula" value="tanpa_gula" checked={gulaOption === 'tanpa_gula'} onChange={() => setGulaOption('tanpa_gula')} />
                    Tanpa Gula (0 Sendok)
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#154784', display: 'block', marginBottom: '8px' }}>Opsi Tambahan Susu:</span>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input type="radio" name="susu" value="pakai" checked={susuOption === 'pakai'} onChange={() => setSusuOption('pakai')} />
                    Pakai Susu Kental Manis
                  </label>
                  <label style={styles.radioLabel}>
                    <input type="radio" name="susu" value="tanpa_susu" checked={susuOption === 'tanpa_susu'} onChange={() => setSusuOption('tanpa_susu')} />
                    Tanpa Susu (0 Gram)
                  </label>
                </div>
              </div>

              {/* TAMPILAN BARU: INPUT BATCH QUANTITY */}
              <div style={{ marginBottom: '15px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#154784' }}>Jumlah Porsi:</span>
                <div style={styles.qtyContainer}>
                  <button type="button" style={styles.qtyBtn} onClick={() => setCustomQty(q => Math.max(1, q - 1))}><FaMinus size={12}/></button>
                  <input 
                    type="number" 
                    min="1" 
                    value={customQty} 
                    onChange={(e) => setCustomQty(Math.max(1, parseInt(e.target.value) || 1))} 
                    style={{ width: '60px', textAlign: 'center', padding: '5px', borderRadius: '6px', border: '1px solid #ddd', fontWeight: 'bold', fontSize: '16px' }}
                  />
                  <button type="button" style={styles.qtyBtn} onClick={() => setCustomQty(q => q + 1)}><FaPlus size={12}/></button>
                </div>
              </div>

              <button 
                style={styles.submitCustomBtn} 
                onClick={() => executeAddToCart(selectedProduct, { gula: gulaOption, susu: susuOption }, customQty)}
              >
                Masukkan {customQty} porsi ke Keranjang
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Transaksi;