// src/pages/Transaksi.jsx
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

  const [isKasirOpen, setIsKasirOpen] = useState(false);
  const [currentShiftData, setCurrentShiftData] = useState(null);
  const [modalAwal, setModalAwal] = useState('');
  const [loadingShift, setLoadingShift] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('Juice'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSavedOrders, setShowSavedOrders] = useState(false);
  const [savedOrders, setSavedOrders] = useState([]);

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [gulaOption, setGulaOption] = useState('normal'); 
  const [susuOption, setSusuOption] = useState('pakai');  
  const [customQty, setCustomQty] = useState(1); 

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
      print("Error checking kasir status:", error);
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
      setCustomQty(1); 
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
if (jumlah <= 0) {
    alert("Eror: Jumlah item yang dimasukkan tidak boleh kurang dari atau sama dengan 1!");
    return; // Menghentikan eksekusi fungsi
  }
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

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />
      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0', paddingBottom: '110px' }}>
        
        {/* SHIFT STATUS CARD RESPONSIVE */}
        <div className="card border-0 bg-light shadow-sm p-3 mb-4 rounded-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold m-0" style={{ color: '#154784', fontSize: '16px' }}>Status Kasir Toko</h5>
              <span className="fw-bold small d-block mt-0.5" style={{ color: isKasirOpen ? '#2e7d32' : '#d32f2f' }}>
                {isKasirOpen ? `● BUKA (Petugas: ${currentShiftData?.petugas_buka})` : "● TUTUP (Offline)"}
              </span>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              {savedOrders.length > 0 && isKasirOpen && (
                <button className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-2 py-2" style={{ backgroundColor: '#154784', border: 'none' }} onClick={() => setShowSavedOrders(true)}>
                  <FaClipboardList /> Antrean <span className="badge bg-danger rounded-circle">{savedOrders.length}</span>
                </button>
              )}

              {isKasirOpen ? (
                <button className="btn btn-danger btn-sm fw-bold d-flex align-items-center gap-2 py-2" onClick={handleTutupKasir} disabled={loadingShift}>
                  <FaDoorClosed /> {loadingShift ? '...' : 'Tutup Shift'}
                </button>
              ) : (
                <div className="d-flex gap-2 w-100 w-sm-auto">
                  <div className="position-relative flex-grow-1">
                    <FaMoneyBillWave className="position-absolute start-0 top-50 translate-middle-y ms-2.5 text-muted" size={14} />
                    <input 
                      type="number" 
                      placeholder="Modal" 
                      className="form-control form-control-sm ps-5 bg-white shadow-none py-2" 
                      value={modalAwal}
                      onChange={(e) => setModalAwal(e.target.value)}
                      style={{ width: window.innerWidth > 576 ? '120px' : '100%' }}
                    />
                  </div>
                  <button className="btn btn-success btn-sm fw-bold px-3 py-2 text-nowrap" onClick={handleBukaKasir} disabled={loadingShift}>
                    Buka Kasir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DROPDOWN KATEGORI MENU */}
        <div className="mb-4 position-relative">
            <button className="btn btn-primary d-flex align-items-center gap-2 fw-semibold border-0 px-4 py-2" style={{ backgroundColor: '#154784', opacity: isKasirOpen ? 1 : 0.6 }} onClick={() => isKasirOpen && setIsDropdownOpen(!isDropdownOpen)}>
                {selectedCategory} <FaChevronDown size={10} />
            </button>
            {isDropdownOpen && (
                <div className="position-absolute bg-white shadow rounded-3 border-0 mt-1" style={{ width: '180px', zIndex: 100 }}>
                    {['Juice', 'Juice + Ice Cream', 'Ice Cream'].map(cat => (
                        <div key={cat} className="p-3 bg-white border-bottom text-dark small" style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory(cat); setIsDropdownOpen(false); }}>
                            {cat}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* RESPONSIVE FLUID PRODUCT DISPLAY GRID */}
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4 mt-2" style={{ opacity: isKasirOpen ? 1 : 0.3, pointerEvents: isKasirOpen ? 'auto' : 'none' }}>
            {products.filter(p => p.category === selectedCategory).map((prod) => (
                <div key={prod.id} className="col text-center" style={{ cursor: 'pointer' }} onClick={() => handleProductClick(prod)}>
                    <div className="mx-auto rounded-circle overflow-hidden bg-white shadow-sm border border-4 border-white mb-2" style={{ width: '110px', height: '110px' }}>
                        <img src={prod.image} alt={prod.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="fw-bold text-dark small" style={{ fontSize: '13px' }}>{prod.name}</div>
                    <div className="text-secondary font-monospace small" style={{ fontSize: '12px' }}>{formatRupiah(prod.price)}</div>
                </div>
            ))}
        </div>

        {/* FLOATING BOTTOM BANNER RESPONSIVE */}
        {totalItems > 0 && isKasirOpen && (
            <div 
              className="position-fixed bottom-0 start-50 translate-middle-x bg-primary text-white d-flex align-items-center justify-content-center gap-2 p-3 shadow-lg border-0 w-100" 
              style={{ backgroundColor: '#154784', zIndex: 1040, cursor: 'pointer', maxWidth: window.innerWidth > 768 ? '450px' : '100%', marginBottom: window.innerWidth > 768 ? '25px' : '0', borderRadius: window.innerWidth > 768 ? '15px' : '0' }} 
              onClick={handleGoToCart}
            >
                <FaShoppingCart />
                <span className="fw-bold">{totalItems} Item Terpilih | {formatRupiah(totalPrice)}</span>
            </div>
        )}

        {/* STATUS KASIR CLOSED WATERMARK */}
        {!isKasirOpen && !loadingShift && (
          <div className="position-absolute start-50 top-50 translate-middle text-center" style={{ opacity: 0.4 }}>
            <FaStore size={54} className="text-muted mb-2" />
            <h5 className="text-muted fw-bold">Kasir Belum Aktif</h5>
          </div>
        )}

        {/* MODAL ANTI-ANTREAN POPUP */}
        {showSavedOrders && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}>
            <div className="card border-0 shadow-lg p-4 bg-white rounded-3 w-100" style={{ maxWidth: '400px' }}>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <h4 className="fw-bold m-0" style={{ fontSize: '16px' }}>Antrean Pesanan</h4>
                <button className="btn btn-link text-muted p-0" onClick={() => setShowSavedOrders(false)}><FaTimes /></button>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {savedOrders.map((order, index) => (
                  <div key={index} className="p-3 border-bottom bg-white" style={{ cursor: 'pointer' }} onClick={() => handleLoadOrder(order)}>
                    <div className="fw-bold text-primary small">{order.note || "Tanpa Catatan"}</div>
                    <div className="text-muted font-monospace mt-0.5" style={{ fontSize: '12px' }}>{order.items.length} Produk - {formatRupiah(order.total)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL KUSTOMISASI DOSIS AI */}
        {showCustomModal && selectedProduct && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}>
            <div className="card border-0 shadow-lg p-4 bg-white rounded-3 w-100" style={{ maxWidth: '420px' }}>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <h4 className="fw-bold text-dark m-0" style={{ fontSize: '16px' }}>Kustom {selectedProduct.name}</h4>
                <button className="btn btn-link text-muted p-0" onClick={() => setShowCustomModal(false)}><FaTimes /></button>
              </div>
              
              <div className="mb-3">
                <span className="fw-bold text-dark small d-block mb-2" style={{ color: '#154784' }}>Takaran Gula Cair:</span>
                <div className="d-flex flex-column gap-2 small">
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="radio" className="form-check-input" name="gula" value="normal" checked={gulaOption === 'normal'} onChange={() => setGulaOption('normal')} />
                    Normal (Resep Utama Varisha)
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="radio" className="form-check-input" name="gula" value="sedikit" checked={gulaOption === 'sedikit'} onChange={() => setGulaOption('sedikit')} />
                    Gula Sedikit (1 Sendok Makan)
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="radio" className="form-check-input" name="gula" value="tanpa_gula" checked={gulaOption === 'tanpa_gula'} onChange={() => setGulaOption('tanpa_gula')} />
                    Tanpa Manis Tambahan (0 Gula)
                  </label>
                </div>
              </div>

              <div className="mb-3 border-top pt-2">
                <span className="fw-bold text-dark small d-block mb-2" style={{ color: '#154784' }}>Opsi SKM Tambahan:</span>
                <div className="d-flex flex-column gap-2 small">
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="radio" className="form-check-input" name="susu" value="pakai" checked={susuOption === 'pakai'} onChange={() => setSusuOption('pakai')} />
                    Pakai Susu Kental Manis
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="radio" className="form-check-input" name="susu" value="tanpa_susu" checked={susuOption === 'tanpa_susu'} onChange={() => setSusuOption('tanpa_susu')} />
                    Murni Tanpa Susu (0 Gram)
                  </label>
                </div>
              </div>

              {/* BATCH BUNDLING QUANTITY INPUT CONTAINER */}
              <div className="mb-3 text-center border-top pt-3">
                <span className="fw-bold text-dark small" style={{ color: '#154784' }}>Jumlah Pesanan:</span>
                <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
                  <button type="button" className="btn btn-light border-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }} onClick={() => setCustomQty(q => Math.max(1, q - 1))}><FaMinus size={11}/></button>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-control bg-light text-center fw-bold font-monospace shadow-none p-1"
                    value={customQty} 
                    onChange={(e) => setCustomQty(Math.max(1, parseInt(e.target.value) || 1))} 
                    style={{ width: '55px', fontSize: '15px' }}
                  />
                  <button type="button" className="btn btn-light border-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }} onClick={() => setCustomQty(q => q + 1)}><FaPlus size={11}/></button>
                </div>
              </div>

              <button className="btn btn-primary w-100 fw-bold py-2.5 rounded-3 border-0 mt-2" style={{ backgroundColor: '#154784' }} onClick={() => executeAddToCart(selectedProduct, { gula: gulaOption, susu: susuOption }, customQty)}>
                Masukkan {customQty} Porsi ke Nota
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Transaksi;