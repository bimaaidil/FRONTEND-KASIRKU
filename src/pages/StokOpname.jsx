import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase'; 
import { collection, getDocs, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const StokOpname = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stokFisik, setStokFisik] = useState('');
    const [keterangan, setKeterangan] = useState('Audit Berkala');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userNameAdmin = localStorage.getItem('userName') || "Admin"; 

    useEffect(() => {
        const fetchAllIngredients = async () => {
            try {
                // 1. Ambil data buah dari koleksi "products"
                const queryFruits = await getDocs(collection(db, "products"));
                const fruitsData = queryFruits.docs.map(doc => ({
                    id: doc.id,
                    isBahanPelengkap: false,
                    ...doc.data()
                }));

                // 2. REVISI: Ambil data dari koleksi "bahan_pelengkap" (Gula, Susu, Pipet, Plastik)
                const queryPelengkap = await getDocs(collection(db, "bahan_pelengkap"));
                const pelengkapData = queryPelengkap.docs.map(doc => {
                    const res = doc.data();
                    return {
                        id: doc.id,
                        isBahanPelengkap: true,
                        // Mapping agar nama field selaras dengan fruitsData
                        nama: res.nama || res.name || doc.id, 
                        stok: res.stok_sekarang ?? 0,
                        satuan: res.satuan
                    };
                });

                // Gabungkan kedua sumber data
                const combinedData = [...fruitsData, ...pelengkapData];

                // MENGURUTKAN SELURUH DATA A-Z BERDASARKAN NAMA BAHAN
                const sortedData = combinedData.sort((a, b) => {
                    const nameA = (a.nama || "").toLowerCase();
                    const nameB = (b.nama || "").toLowerCase();
                    return nameA.localeCompare(nameB);
                });

                setProducts(sortedData);
            } catch (error) {
                console.error("ERROR saat fetch data:", error.message);
                alert("Gagal mengambil data produk dan bahan pelengkap.");
            }
        };
        fetchAllIngredients();
    }, []);

    const handleSimpan = async (e) => {
        e.preventDefault();
        if (!selectedProduct || stokFisik === '') {
            alert("Harap pilih produk dan masukkan jumlah fisik nyata!");
            return;
        }

        const fisik = parseFloat(stokFisik);
        const selisih = fisik - (selectedProduct.stok || 0);

        setLoading(true);
        try {
            await runTransaction(db, async (transaction) => {
                let produkRef;
                
                // Tentukan referensi dokumen berdasarkan asal koleksi
                if (selectedProduct.isBahanPelengkap) {
                    produkRef = doc(db, "bahan_pelengkap", selectedProduct.id);
                    // Update field sesuai nama field di koleksi bahan_pelengkap
                    transaction.update(produkRef, { stok_sekarang: fisik });
                } else {
                    produkRef = doc(db, "products", selectedProduct.id);
                    transaction.update(produkRef, { stok: fisik });
                }

                const opnameRef = doc(collection(db, "stok_opname"));

                transaction.set(opnameRef, {
                    id_produk: selectedProduct.id,
                    nama_produk: selectedProduct.nama, 
                    stok_sistem: selectedProduct.stok || 0,
                    stok_fisik: fisik,
                    selisih: selisih,
                    keterangan: keterangan,
                    unit: getUnitDisplay(selectedProduct),
                    waktu_pengecekan: serverTimestamp(),
                    petugas: userNameAdmin,
                    kategori_koleksi: selectedProduct.isBahanPelengkap ? "bahan_pelengkap" : "products"
                });
            });

            alert(`Sukses! Stok ${selectedProduct.nama} diperbarui.`);
            navigate('/kelola-produk');
        } catch (error) {
            console.error("Gagal simpan:", error);
            alert("Gagal menyimpan data opname.");
        } finally {
            setLoading(false);
        }
    };

    // REVISI: Fungsi Pembantu untuk menentukan Satuan (kg vs buah vs gram vs pcs)
    const getUnitDisplay = (product) => {
        if (!product) return '';
        if (product.isBahanPelengkap && product.satuan) {
            return product.satuan; // Ambil langsung dari field satuan Firestore
        }
        const nama = product.nama || '';
        const buahSatuan = ['Semangka', 'Melon', 'Nenas', 'Nanas'];
        if (buahSatuan.some(b => nama.includes(b))) {
            return 'buah';
        }
        return 'kg';
    };

    const styles = {
        layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fc', fontFamily: "'Poppins', sans-serif" },
        mainContent: { marginLeft: '260px', width: '100%', padding: '40px' },
        cardOpname: { maxWidth: '800px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '30px' },
        headerTitle: { fontSize: '24px', fontWeight: '700', color: '#154784', marginBottom: '10px' },
        formGroup: { marginBottom: '20px' },
        label: { fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px', display: 'block' },
        input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' },
        infoBox: { backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold' },
        btnSubmit: { backgroundColor: '#154784', color: 'white', padding: '12px 25px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }
    };

    const selisihDisplay = selectedProduct && stokFisik !== '' ? (parseFloat(stokFisik) - selectedProduct.stok).toFixed(2) : 0;

    return (
        <div style={styles.layout}>
            <Sidebar />
            <div style={styles.mainContent}>
                <div style={styles.cardOpname}>
                    <h2 style={styles.headerTitle}>Input Stok Opname</h2>
                    <p className="text-muted mb-4">Sinkronisasi stok operasional Varisha Jus.</p>
                    
                    <form onSubmit={handleSimpan}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Pilih Bahan Baku / Produk (Urutan A-Z)</label>
                            <select 
                                style={styles.input} 
                                value={selectedProduct ? selectedProduct.id : ""}
                                onChange={(e) => {
                                    const prod = products.find(p => p.id === e.target.value);
                                    setSelectedProduct(prod);
                                    setStokFisik(''); 
                                }}
                            >
                                <option value="">-- Cari Buah/Bahan Baku --</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nama} (Sistem: {p.stok ?? 0} {getUnitDisplay(p)}) 
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedProduct && (
                            <>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Jumlah Fisik Nyata (Input Per {getUnitDisplay(selectedProduct)})
                                    </label>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input 
                                            type="number" 
                                            step={['buah', 'pcs'].includes(getUnitDisplay(selectedProduct)) ? "1" : "0.01"} 
                                            style={{ ...styles.input, flex: 1 }} 
                                            value={stokFisik} 
                                            onChange={(e) => setStokFisik(e.target.value)} 
                                            placeholder={`Contoh: ${['buah', 'pcs'].includes(getUnitDisplay(selectedProduct)) ? '5' : '1500.00'}`}
                                        />
                                        <span style={{ fontWeight: 'bold', color: '#154784', width: '80px' }}>
                                            {getUnitDisplay(selectedProduct)}
                                        </span>
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Keterangan/Alasan</label>
                                    <select style={styles.input} value={keterangan} onChange={(e) => setKeterangan(e.target.value)}>
                                        <option value="Audit Berkala">Audit Berkala</option>
                                        <option value="Buah Busuk">Bahan Baku Rusak / Busuk / Expired</option>
                                        <option value="Hilang">Bahan Baku Hilang</option>
                                        <option value="Salah Input">Salah Input</option>
                                    </select>
                                </div>

                                <div style={styles.infoBox}>
                                    <span>Selisih Stok:</span>
                                    <span style={{ color: selisihDisplay < 0 ? '#d32f2f' : '#2e7d32' }}>
                                        {selisihDisplay} {getUnitDisplay(selectedProduct)}
                                    </span>
                                </div>
                            </>
                        )}

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'end', gap: '10px' }}>
                            <button type="button" className="btn btn-light" onClick={() => navigate('/kelola-produk')}>Batal</button>
                            <button type="submit" style={styles.btnSubmit} disabled={loading}>
                                {loading ? 'Memproses...' : 'Simpan Sinkronisasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StokOpname;