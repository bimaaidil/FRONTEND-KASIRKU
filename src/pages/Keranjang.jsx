import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTimes, FaTrash, FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa';
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

  // --- HITUNG AKUMULASI PENGURANGAN BAHAN PELENGKAP ---
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

  // --- REVISI: FUNGSI MANDIRI UNTUK EKSEKUSI POTONG STOK DI BACKGROUND ---
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

  // --- TOMBOL 1: HANDLING SIMPAN / ANTRIAN ---
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

      // 1. Eksekusi pemotongan stok bahan pelengkap
      await eksekusiPotongStokFisik();

      // 2. Buat ID nota berbasis waktu urutan atas
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

  // --- REVISI: TOMBOL 2: HANDLING LANGSUNG BAYAR ---
  const handleLangsungBayar = async () => {
    if (cart.length === 0 || isProcessing) return;
    setIsProcessing(true);
    try {
      // Potong stok gudang terlebih dahulu sebelum pindah halaman pembayaran luar
      await eksekusiPotongStokFisik();
      
      // Simpan data keranjang ke localStorage agar halaman pembayaran bisa menarik isinya
      localStorage.setItem('cartData', JSON.stringify(cart));
      navigate('/pembayaran');
    } catch (error) {
      console.error("Gagal memproses pemotongan stok sebelum pembayaran:", error);
      alert("Terjadi masalah sistem saat memproses stok.");
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    headerBar: { backgroundColor: '#154784', padding: '15px 30px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '18px', fontWeight: '600' },
    backButton: { background: 'transparent', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    clearBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#ff7675', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
    content: { padding: '40px 60px', maxWidth: '1200px', margin: '0 auto' },
    tableContainer: { border: '1px solid #ddd', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: 'white', marginBottom: '30px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'center', padding: '15px', borderBottom: '2px solid #ddd', fontWeight: 'bold', color: '#333' },
    td: { textAlign: 'center', padding: '15px', borderBottom: '1px solid #eee', color: '#333', fontWeight: '500' },
    tr: { cursor: 'pointer', transition: 'background 0.2s' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
    btnContainer: { display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '20px' },
    btnAction: { backgroundColor: '#154784', color: 'white', border: 'none', padding: '15px 0', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '45%', textAlign: 'center' },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    popupCard: { backgroundColor: 'white', width: '500px', borderRadius: '12px', padding: '30px', position: 'relative' },
    saveModalCard: { backgroundColor: 'white', width: '400px', borderRadius: '10px', padding: '25px', textAlign: 'center' },
    saveConfirmBtn: { width: '100%', backgroundColor: '#154784', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
        <div style={styles.headerBar}>
            <button style={styles.backButton} onClick={() => navigate('/transaksi')}>
                <FaArrowLeft /> Menu
            </button>
            {cart.length > 0 && (
              <button style={styles.clearBtn} onClick={handleClearCart}>
                <FaTrashAlt /> Kosongkan Keranjang
              </button>
            )}
        </div>

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
                            <tr key={item.cartItemId} style={styles.tr} onClick={() => handleRowClick(item)}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>
                                  {item.name} 
                                  {item.options && (
                                    <span style={{ fontSize: '11px', color: '#00b894', display: 'block' }}>
                                      ({item.options.gula === 'sedikit' ? 'Gula Sedikit' : item.options.gula === 'tanpa_gula' ? 'Tanpa Gula' : 'Gula Normal'}, 
                                      {item.options.susu === 'tanpa_susu' ? ' Tanpa Susu' : ' Pakai Susu'})
                                    </span>
                                  )}
                                </td>
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
                <div style={{fontWeight: 'bold'}}>Total ({totalItems})</div>
                <div style={{fontWeight: 'bold'}}>{formatRupiah(totalPrice)}</div>
            </div>

            <div style={styles.btnContainer}>
                <button style={styles.btnAction} onClick={() => cart.length > 0 && setShowSaveModal(true)}>Simpan</button>
                {/* REVISI: Mengubah target onClick tombol bayar ke fungsi handleLangsungBayar */}
                <button style={styles.btnAction} onClick={handleLangsungBayar} disabled={isProcessing}>
                  {isProcessing ? "Memproses..." : "Bayar"}
                </button>
            </div>
        </div>

        {/* MODAL EDIT */}
        {editingItem && (
          <div style={styles.overlay}>
              <div style={styles.popupCard}>
                  <button style={{position:'absolute', right:'20px', top:'20px', border:'none', background:'none', cursor:'pointer'}} onClick={() => setEditingItem(null)}><FaTimes/></button>
                  <h3>Edit {editingItem.name}</h3>
                  <div style={{margin:'20px 0', display:'flex', justifyContent:'center', alignItems:'center', gap:'20px'}}>
                    <button style={{border:'1px solid #ddd', padding:'10px', borderRadius:'50%'}} onClick={() => setEditQty(q => Math.max(1, q - 1))}><FaMinus/></button>
                    <span style={{fontSize:'20px', fontWeight:'bold'}}>{editQty}</span>
                    <button style={{border:'1px solid #ddd', padding:'10px', borderRadius:'50%'}} onClick={() => setEditQty(q => q + 1)}><FaPlus/></button>
                  </div>
                  <input type="text" placeholder="Catatan" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'20px'}}/>
                  <button style={{width:'100%', color:'#e74c3c', border:'none', background:'none', marginBottom:'10px', cursor:'pointer'}} onClick={handleDeleteItem}><FaTrash/> Hapus Item</button>
                  <button style={styles.saveConfirmBtn} onClick={handleSaveChanges}>Simpan Perubahan</button>
              </div>
          </div>
        )}

        {/* MODAL SIMPAN */}
        {showSaveModal && (
            <div style={styles.overlay}>
                <div style={styles.saveModalCard}>
                    <h3>Simpan Pesanan</h3>
                    <input type="text" placeholder="Catatan (Meja/Nama)" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} style={{width:'100%', padding:'10px', margin:'20px 0'}} />
                    <button style={styles.saveConfirmBtn} onClick={handleConfirmSave} disabled={isProcessing}>{isProcessing ? "Menyimpan..." : "Simpan Pesanan"}</button>
                    <button style={{width:'100%', marginTop:'10px', border:'none', background:'none', cursor:'pointer'}} onClick={() => setShowSaveModal(false)}>Batal</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Keranjang;