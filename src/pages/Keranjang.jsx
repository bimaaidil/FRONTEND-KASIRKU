// src/pages/Keranjang.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { db } from '../config/firebase'; 
import { collection, addDoc, serverTimestamp, doc, runTransaction, setDoc } from 'firebase/firestore';

const Keranjang = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || "Petugas";
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartData');
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [editDesc, setEditDesc] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartData', JSON.stringify(cart));
  }, [cart]);

  const handleClearCart = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua menu di keranjang?")) {
      setCart([]);
      localStorage.removeItem('cartData');
      alert("Keranjang telah dikosongkan.");
    }
  };

  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const interpretasiKodeCuaca = (code) => {
    if (code === 0) return "Cerah";
    if (code >= 1 && code <= 3) return "Berawan";
    if (code >= 45 && code <= 48) return "Kabut";
    if (code >= 51 && code <= 67) return "Gerimis";
    if (code >= 71 && code <= 82) return "Hujan";
    return "Lainnya";
  };

  const handleRowClick = (item) => {
    setEditingItem(item);
    setEditQty(item.qty);
    setEditDesc(item.description || '');
  };

  const handleSaveChanges = () => {
    const updatedCart = cart.map(item => item.cartItemId === editingItem.cartItemId ? { ...item, qty: editQty, description: editDesc } : item);
    setCart(updatedCart);
    setEditingItem(null);
  };

  const handleDeleteItem = () => {
    const updatedCart = cart.filter(item => item.cartItemId !== editingItem.cartItemId);
    setCart(updatedCart);
    setEditingItem(null);
  };

  const hitungPenguranganBahan = (cartItems) => {
    let totalGula = 0;
    let totalSusuPutih = 0;
    let totalSusuCokelat = 0;
    let totalPipet = 0;
    let totalPlastik = 0;

    cartItems.forEach(item => {
      const namaBuah = item.name.toLowerCase();
      const qty = item.qty;
      const opsiGula = item.options?.gula || 'normal';
      const opsiSusu = item.options?.susu || 'pakai';

      if (item.category === 'Juice' || item.category === 'Juice + Ice Cream') {
        totalPipet += 1 * qty;
        totalPlastik += 1 * qty;
      }

      if (item.category === 'Ice Cream') return;

      if (opsiGula === 'tanpa_gula') {
        totalGula += 0;
      } else if (opsiGula === 'sedikit') {
        totalGula += 40 * qty; 
      } else {
        const buahTigaSendok = ['belimbing', 'jeruk', 'terong belanda', 'terong bld ice cream', 'timun'];
        const IsTigaSendok = buahTigaSendok.some(b => namaBuah.includes(b));
        
        if (IsTigaSendok) {
          totalGula += 120 * qty; 
        } else {
          totalGula += 100 * qty; 
        }
      }

      if (opsiSusu === 'pakai') {
        if (namaBuah.includes('pokat')) {
          totalSusuCokelat += 10 * qty;
        }

        const buahSusuDuaPuluh = ['jagung', 'naga', 'terong belanda', 'terong bld ice cream'];
        const buahTanpaSusu = ['belimbing', 'jeruk', 'timun'];

        if (buahSusuDuaPuluh.some(b => namaBuah.includes(b))) {
          totalSusuPutih += 20 * qty;
        } else if (buahTanpaSusu.some(b => namaBuah.includes(b))) {
          totalSusuPutih += 0;
        } else {
          totalSusuPutih += 10 * qty; 
        }
      }
    });

    return { totalGula, totalSusuPutih, totalSusuCokelat, totalPipet, totalPlastik };
  };

  const eksekusiPotongStokFisik = async () => {
    const bahanKurang = hitungPenguranganBahan(cart);
    
    await runTransaction(db, async (transaction) => {
      const gulaRef = doc(db, "bahan_pelengkap", "gula");
      const susuPutihRef = doc(db, "bahan_pelengkap", "susu_putih");
      const susuCokelatRef = doc(db, "bahan_pelengkap", "susu_cokelat");
      const pipetRef = doc(db, "bahan_pelengkap", "pipet");
      const plastikRef = doc(db, "bahan_pelengkap", "plastik");

      const gulaSnap = await transaction.get(gulaRef);
      const susuPutihSnap = await transaction.get(susuPutihRef);
      const susuCokelatSnap = await transaction.get(susuCokelatRef);
      const pipetSnap = await transaction.get(pipetRef);
      const plastikSnap = await transaction.get(plastikRef);

      if (gulaSnap.exists() && bahanKurang.totalGula > 0) {
        const stokBaru = Math.max(0, gulaSnap.data().stok_sekarang - bahanKurang.totalGula);
        transaction.update(gulaRef, { stok_sekarang: stokBaru });
      }
      if (susuPutihSnap.exists() && bahanKurang.totalSusuPutih > 0) {
        const stokBaru = Math.max(0, susuPutihSnap.data().stok_sekarang - bahanKurang.totalSusuPutih);
        transaction.update(susuPutihRef, { stok_sekarang: stokBaru });
      }
      if (susuCokelatSnap.exists() && bahanKurang.totalSusuCokelat > 0) {
        const stokBaru = Math.max(0, susuCokelatSnap.data().stok_sekarang - bahanKurang.totalSusuCokelat);
        transaction.update(susuCokelatRef, { stok_sekarang: stokBaru });
      }
      if (pipetSnap.exists() && bahanKurang.totalPipet > 0) {
        const stokBaru = Math.max(0, pipetSnap.data().stok_sekarang - bahanKurang.totalPipet);
        transaction.update(pipetRef, { stok_sekarang: stokBaru });
      }
      if (plastikSnap.exists() && bahanKurang.totalPlastik > 0) {
        const stokBaru = Math.max(0, plastikSnap.data().stok_sekarang - bahanKurang.totalPlastik);
        transaction.update(plastikRef, { stok_sekarang: stokBaru });
      }
    });
  };

  const handleConfirmSave = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=0.507&longitude=101.447&current_weather=true&hourly=relative_humidity_2m");
      const weatherData = await weatherRes.json();
      
      const suhuSekarang = weatherData.current_weather.temperature;
      const kodeCuaca = weatherData.current_weather.weathercode; 
      const kelembapanSekarang = weatherData.hourly ? weatherData.hourly.relative_humidity_2m[0] : 0;

      const dataTransaksi = {
        catatan_pesanan: orderNote,
        items: cart,
        total_harga: totalPrice,
        total_item: totalItems,
        petugas: userName,
        waktu: serverTimestamp(),
        suhu: suhuSekarang || 0,
        kelembapan: kelembapanSekarang || 0,
        kondisi_cuaca: interpretasiKodeCuaca(kodeCuaca) || "Tidak Diketahui",
        status_pembayaran: "PENDING"
      };

      await eksekusiPotongStokFisik();

      const waktuSekarang = new Date();
      const formatIDCustom = "TX_" + waktuSekarang.getFullYear() +
        String(waktuSekarang.getMonth() + 1).padStart(2, '0') +
        String(waktuSekarang.getDate()).padStart(2, '0') + "_" +
        String(waktuSekarang.getHours()).padStart(2, '0') +
        String(waktuSekarang.getMinutes()).padStart(2, '0') +
        String(waktuSekarang.getSeconds()).padStart(2, '0');

      const docRef = doc(db, "transactions", formatIDCustom);
      await setDoc(docRef, dataTransaksi);
      
      const savedOrders = JSON.parse(localStorage.getItem('savedOrders')) || [];
      savedOrders.push({ id: formatIDCustom, note: orderNote, total: totalPrice, items: cart });
      localStorage.setItem('savedOrders', JSON.stringify(savedOrders));

      alert(`Pesanan Berhasil Disimpan & Stok Dipotong!\nSuasana: ${suhuSekarang}°C, Lembap: ${kelembapanSekarang}%`);
      localStorage.removeItem('cartData');
      setCart([]); 
      setShowSaveModal(false);
      navigate('/transaksi'); 
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Gagal menyimpan pesanan.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLangsungBayar = async () => {
    if (cart.length === 0 || isProcessing) return;
    setIsProcessing(true);
    try {
      await eksekusiPotongStokFisik();
      localStorage.setItem('cartData', JSON.stringify(cart));
      navigate('/pembayaran');
    } catch (error) {
      console.error("Gagal memproses pemotongan stok sebelum pembayaran:", error);
      alert("Terjadi masalah sistem saat memproses stok.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
        {/* Header Responsif */}
        <div className="px-3 py-3 d-flex align-items-center justify-content-between text-white" style={{ backgroundColor: '#760710' }}>
            <button className="btn btn-link text-white text-decoration-none fw-bold p-0 d-flex align-items-center gap-2" onClick={() => navigate('/transaksi')}>
                <FaArrowLeft /> Menu
            </button>
            {cart.length > 0 && (
              <button className="btn btn-sm btn-danger d-flex align-items-center gap-1.5 px-3 rounded-pill fw-semibold" style={{ fontSize: '13px' }} onClick={handleClearCart}>
                <FaTrashAlt size={12} /> Kosongkan
              </button>
            )}
        </div>

        {/* List Keranjang Belanja */}
        <div className="container py-4 px-2 px-md-4" style={{ maxWidth: '900px' }}>
            <div className="card border-0 shadow-sm p-3 p-md-4 rounded-3 bg-white mb-3">
              <div className="table-responsive">
                <table className="table align-middle text-nowrap m-0" style={{ fontSize: '14px' }}>
                    <thead>
                        <tr className="text-secondary small text-uppercase">
                            <th className="border-0 text-center pb-3">No</th>
                            <th className="border-0 pb-3">Produk</th>
                            <th className="border-0 text-center pb-3">Qty</th>
                            <th className="border-0 text-center pb-3">Harga</th>
                            <th className="border-0 text-center pb-3">Sub Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.length > 0 ? cart.map((item, index) => (
                            <tr key={item.cartItemId} className="border-top" style={{ cursor: 'pointer' }} onClick={() => handleRowClick(item)}>
                                <td className="py-3 text-center text-muted">{index + 1}</td>
                                <td className="py-3 text-dark fw-medium">
                                  {item.name} 
                                  {item.options && (
                                    <span className="fw-semibold d-block small text-success mt-0.5" style={{ fontSize: '11px' }}>
                                      ({item.options.gula === 'sedikit' ? 'Gula Sedikit' : item.options.gula === 'tanpa_gula' ? 'Tanpa Gula' : 'Gula Normal'}, 
                                      {item.options.susu === 'tanpa_susu' ? ' Tanpa Susu' : ' Pakai Susu'})
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 text-center fw-bold">{item.qty}</td>
                                <td className="py-3 text-center text-secondary">{formatRupiah(item.price)}</td>
                                <td className="py-3 text-center text-primary fw-bold">{formatRupiah(item.price * item.qty)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center text-muted py-5 small">Keranjang pesanan masih kosong.</td></tr>
                        )}
                    </tbody>
                </table>
              </div>
            </div>

            {/* Bagian Total */}
            <div className="card border-0 shadow-sm p-3 px-4 rounded-3 bg-white d-flex flex-row justify-content-between align-items-center mb-4">
                <div className="fw-bold text-dark">Total Ringkasan ({totalItems} Item)</div>
                <div className="fw-bold text-primary style={{ fontSize: '16px' }}">{formatRupiah(totalPrice)}</div>
            </div>

            {/* Tombol Footer Utama */}
            <div className="row g-3">
                <div className="col-6">
                  <button className="btn btn-secondary w-100 fw-bold py-2.5 rounded-3 border-0 bg-secondary-subtle text-secondary" onClick={() => cart.length > 0 && setShowSaveModal(true)}>
                    Simpan Antrean
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-success w-100 fw-bold py-2.5 rounded-3 border-0" style={{ backgroundColor: '#27ae60' }} onClick={handleLangsungBayar} disabled={isProcessing}>
                    {isProcessing ? "Memproses..." : "Bayar Langsung"}
                  </button>
                </div>
            </div>
        </div>

        {/* MODAL EDIT PRODUK POPUP */}
        {editingItem && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}>
              <div className="card border-0 shadow-lg p-4 bg-white rounded-3 w-100 position-relative" style={{ maxWidth: '440px' }}>
                  <button className="btn btn-link text-muted position-absolute end-0 top-0 mt-3 me-3 p-0" onClick={() => setEditingItem(null)}><FaTimes/></button>
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-3" style={{ fontSize: '18px' }}>Edit {editingItem.name}</h4>
                  
                  <div className="d-flex justify-content-center align-items-center gap-3 my-4">
                    <button className="btn btn-light border-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} onClick={() => setEditQty(q => Math.max(1, q - 1))}><FaMinus/></button>
                    <span className="fs-3 fw-bold text-dark font-monospace px-2">{editQty}</span>
                    <button className="btn btn-light border-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} onClick={() => setEditQty(q => q + 1)}><FaPlus/></button>
                  </div>

                  <div className="mb-3">
                    <input type="text" className="form-control bg-light py-2 small" placeholder="Tambahkan catatan khusus item..." value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
                  </div>
                  
                  <button className="btn btn-link text-danger w-100 fw-bold text-decoration-none small mb-3" onClick={handleDeleteItem}>Hapus dari Keranjang</button>
                  <button className="btn text-white w-100 fw-bold py-2.5 rounded-3" style={{ backgroundColor: '#154784', border: 'none' }} onClick={handleSaveChanges}>Simpan Perubahan</button>
              </div>
          </div>
        )}

        {/* MODAL SIMPAN ANTRIAN POPUP */}
        {showSaveModal && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}>
                <div className="card border-0 shadow-lg p-4 bg-white rounded-3 w-100 text-center" style={{ maxWidth: '380px' }}>
                    <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>Simpan Nomor Meja</h4>
                    <input type="text" className="form-control bg-light text-center py-2 mb-4" placeholder="Contoh: Meja 05 / Atas Nama" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
                    <button className="btn text-white w-100 fw-bold py-2.5 rounded-3 mb-2" style={{ backgroundColor: '#154784', border: 'none' }} onClick={handleConfirmSave} disabled={isProcessing}>{isProcessing ? "Menyimpan..." : "Konfirmasi Simpan"}</button>
                    <button className="btn btn-link text-muted w-100 text-decoration-none small" onClick={() => setShowSaveModal(false)}>Batalkan</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Keranjang;