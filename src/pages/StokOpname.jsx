import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase'; 
import { collection, getDocs, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const StokOpname = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [stokFisik, setStokFisik] = useState('');
    const [keterangan, setKeterangan] = useState('Buah Busuk');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const userNameAdmin = localStorage.getItem('userName') || "Admin"; 

    useEffect(() => {
        const fetchProducts = async () => {
            console.log("Mencoba mengambil data dari koleksi 'products'...");
            try {
                // Pastikan nama koleksi 'products' sesuai dengan yang di Firebase Console
                const querySnapshot = await getDocs(collection(db, "products"));
                
                if (querySnapshot.empty) {
                    console.warn("Koleksi 'products' ditemukan tapi isinya KOSONG.");
                }

                const data = querySnapshot.docs.map(doc => {
                    const res = { id: doc.id, ...doc.data() };
                    console.log("Data ditemukan:", res); // Ini akan muncul di Inspect Element > Console
                    return res;
                });
                
                setProducts(data);
            } catch (error) {
                console.error("ERROR saat fetch data:", error.message);
                alert("Gagal koneksi ke Firebase. Cek koneksi internet atau config.");
            }
        };
        fetchProducts();
    }, []);

    const handleSimpan = async (e) => {
        e.preventDefault();
        if (!selectedProduct || stokFisik === '') {
            alert("Harap pilih produk dan masukkan jumlah fisik nyata!");
            return;
        }

        const fisik = parseInt(stokFisik);
        const selisih = fisik - selectedProduct.stok;

        setLoading(true);
        try {
            await runTransaction(db, async (transaction) => {
                const produkRef = doc(db, "products", selectedProduct.id);
                const opnameRef = doc(collection(db, "stok_opname"));

                transaction.update(produkRef, { stok: fisik });

                transaction.set(opnameRef, {
                    id_produk: selectedProduct.id,
                    nama_produk: selectedProduct.nama, 
                    stok_sistem: selectedProduct.stok,
                    stok_fisik: fisik,
                    selisih: selisih,
                    keterangan: keterangan,
                    waktu_pengecekan: serverTimestamp(),
                    petugas: userNameAdmin
                });
            });

            alert(`Sukses! Stok ${selectedProduct.nama} telah diperbarui.`);
            navigate('/kelola-produk');
        } catch (error) {
            console.error("Gagal simpan:", error);
            alert("Gagal menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    // --- STYLES ---
    const styles = {
        layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7fc' },
        mainContent: { marginLeft: '260px', width: '100%', padding: '40px' },
        cardOpname: { maxWidth: '800px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '30px' },
        headerTitle: { fontSize: '24px', fontWeight: '700', color: '#154784', marginBottom: '10px' },
        formGroup: { marginBottom: '20px' },
        label: { fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px', display: 'block' },
        input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' },
        infoBox: { backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontWeight: 'bold' },
        btnSubmit: { backgroundColor: '#154784', color: 'white', padding: '12px 25px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }
    };

    const selisihDisplay = selectedProduct && stokFisik !== '' ? parseInt(stokFisik) - selectedProduct.stok : 0;

    return (
        <div style={styles.layout}>
            <Sidebar />
            <div style={styles.mainContent}>
                <div style={styles.cardOpname}>
                    <h2 style={styles.headerTitle}>Input Stok Opname</h2>
                    <p className="text-muted mb-4">Sinkronisasi data fisik buah/bahan dengan sistem Kasirku.</p>
                    
                    <form onSubmit={handleSimpan}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Pilih Produk</label>
                            <select 
                                style={styles.input} 
                                onChange={(e) => {
                                    const prod = products.find(p => p.id === e.target.value);
                                    setSelectedProduct(prod);
                                }}
                            >
                                <option value="">-- Cari Produk --</option>
                                {products.length > 0 ? (
                                    products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama || "Tanpa Nama"} (Sistem: {p.stok ?? 0} porsi) 
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Tidak ada data produk di database...</option>
                                )}
                            </select>
                        </div>

                        {selectedProduct && (
                            <>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        Jumlah Fisik Nyata 
                                        ({selectedProduct.kategori === 'Minuman' ? 'kg' : 'pcs'})
                                    </label>
                                    <div className="input-group">
                                        <input 
                                            type="number" 
                                            step="0.1" // Supaya bisa input koma (0.1) untuk buah kiloan
                                            style={styles.input} 
                                            value={stokFisik} 
                                            onChange={(e) => setStokFisik(e.target.value)} 
                                            placeholder="Masukkan angka..."
                                        />
                                        <span className="input-group-text">
                                            {/* Logika Satuan Otomatis */}
                                            {['Pokat', 'Naga', 'Mangga', 'Sirsak', 'Jagung'].includes(selectedProduct.nama) ? 'kg' : 'pcs'}
                                        </span>
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Keterangan/Alasan</label>
                                    <select style={styles.input} value={keterangan} onChange={(e) => setKeterangan(e.target.value)}>
                                        <option value="Buah Busuk">Buah Busuk</option>
                                        <option value="Hilang">Produk Hilang</option>
                                        <option value="Salah Input">Salah Input</option>
                                        <option value="Audit Berkala">Audit Berkala</option>
                                    </select>
                                </div>

                                <div style={styles.infoBox}>
                                    <span>Selisih Stok:</span>
                                    <span style={{ color: selisihDisplay < 0 ? 'red' : 'green' }}>
                                        {selisihDisplay}
                                    </span>
                                </div>
                            </>
                        )}

                        <div className="mt-4 d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/kelola-produk')}>Batal</button>
                            <button type="submit" style={styles.btnSubmit} disabled={loading}>
                                {loading ? 'Memproses...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StokOpname;