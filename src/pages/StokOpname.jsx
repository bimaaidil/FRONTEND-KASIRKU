// src/pages/StokOpname.jsx
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
                const queryFruits = await getDocs(collection(db, "products"));
                const fruitsData = queryFruits.docs.map(doc => ({
                    id: doc.id,
                    isBahanPelengkap: false,
                    ...doc.data()
                }));

                const queryPelengkap = await getDocs(collection(db, "bahan_pelengkap"));
                const pelengkapData = queryPelengkap.docs.map(doc => {
                    const res = doc.data();
                    return {
                        id: doc.id,
                        isBahanPelengkap: true,
                        nama: res.nama || res.name || doc.id, 
                        stok: res.stok_sekarang ?? 0,
                        satuan: res.satuan
                    };
                });

                const combinedData = [...fruitsData, ...pelengkapData];

                const sortedData = combinedData.sort((a, b) => {
                    const nameA = (a.nama || "").toLowerCase();
                    const nameB = (b.nama || "").toLowerCase();
                    return nameA.localeCompare(nameB);
                });

                setProducts(sortedData);
            } catch (error) {
                console.error("ERROR saat fetch data:", error.message);
                alert("Gagal mengambil data produk and bahan pelengkap.");
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
                
                if (selectedProduct.isBahanPelengkap) {
                    produkRef = doc(db, "bahan_pelengkap", selectedProduct.id);
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

    const getUnitDisplay = (product) => {
        if (!product) return '';
        if (product.isBahanPelengkap && product.satuan) {
            return product.satuan; 
        }
        const nama = product.nama || '';
        const buahSatuan = ['Semangka', 'Melon', 'Nenas', 'Nanas'];
        if (buahSatuan.some(b => nama.includes(b))) {
            return 'buah';
        }
        return 'kg';
    };

    const selisihDisplay = selectedProduct && stokFisik !== '' ? (parseFloat(stokFisik) - selectedProduct.stok).toFixed(2) : 0;

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
            <Sidebar />
            <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
                <div className="card border-0 shadow-sm p-4 bg-white rounded-3 mx-auto" style={{ maxWidth: '800px' }}>
                    <h2 className="fw-bold m-0" style={{ fontSize: '24px', color: '#154784' }}>Input Stok Opname</h2>
                    <p className="text-muted small mt-1 mb-4">Sinkronisasi stok operasional Varisha Jus.</p>
                    
                    <form onSubmit={handleSimpan}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary small">Pilih Bahan Baku / Produk (Urutan A-Z)</label>
                            <select 
                                className="form-select bg-light py-2.5" 
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
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary small">
                                        Jumlah Fisik Nyata (Input Per {getUnitDisplay(selectedProduct)})
                                    </label>
                                    <div className="d-flex gap-2 align-items-center">
                                        <input 
                                            type="number" 
                                            step={['buah', 'pcs'].includes(getUnitDisplay(selectedProduct)) ? "1" : "0.01"} 
                                            className="form-control bg-light py-2.5" 
                                            value={stokFisik} 
                                            onChange={(e) => setStokFisik(e.target.value)} 
                                            placeholder={`Contoh: ${['buah', 'pcs'].includes(getUnitDisplay(selectedProduct)) ? '5' : '15.00'}`}
                                            required
                                        />
                                        <span className="fw-bold text-primary font-monospace text-center rounded-3 bg-primary-subtle py-2 px-3" style={{ minWidth: '75px' }}>
                                            {getUnitDisplay(selectedProduct)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-secondary small">Keterangan/Alasan</label>
                                    <select className="form-select bg-light py-2.5" value={keterangan} onChange={(e) => setKeterangan(e.target.value)}>
                                        <option value="Audit Berkala">Audit Berkala</option>
                                        <option value="Buah Busuk">Bahan Baku Rusak / Busuk / Expired</option>
                                        <option value="Hilang">Bahan Baku Hilang</option>
                                        <option value="Salah Input">Salah Input</option>
                                    </select>
                                </div>

                                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 my-4 fw-bold shadow-sm" style={{ backgroundColor: '#e3f2fd' }}>
                                    <span className="text-secondary small text-uppercase">Selisih Hitung Stok:</span>
                                    <span style={{ color: selisihDisplay < 0 ? '#d32f2f' : '#2e7d32', fontSize: '16px' }}>
                                        {selisihDisplay > 0 ? `+${selisihDisplay}` : selisihDisplay} {getUnitDisplay(selectedProduct)}
                                    </span>
                                </div>
                            </>
                        )}

                        <div className="d-flex justify-content-end gap-2 border-top pt-4 mt-4">
                            <button type="button" className="btn btn-light border fw-medium px-4" onClick={() => navigate('/kelola-produk')}>Batal</button>
                            <button type="submit" className="btn btn-primary fw-bold px-4" style={{ backgroundColor: '#154784', border: 'none' }} disabled={loading}>
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