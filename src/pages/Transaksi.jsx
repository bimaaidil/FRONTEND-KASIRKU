// src/pages/Transaksi.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 
import { FaUserFriends, FaBox, FaExchangeAlt, FaFileAlt, FaSignOutAlt, FaCalendarCheck, FaChevronDown, FaChartLine } from 'react-icons/fa';

// --- IMPORT GAMBAR DARI ASSETS ---
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

// Ice Cream Images
import icVanillaImg from '../assets/IC Vanilla.jpg';
import icCokelatImg from '../assets/IC Cokelat.jpg';
import icStrawberryImg from '../assets/IC Strawberry.jpg';
import icMixImg from '../assets/IC Mix.jpg';

const Transaksi = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [selectedCategory, setSelectedCategory] = useState('Ice Cream'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 1. STATE KERANJANG (Ambil data dari LocalStorage saat pertama kali load)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartData');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. EFFECT (Simpan ke LocalStorage setiap kali keranjang berubah)
  useEffect(() => {
    localStorage.setItem('cartData', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // --- DATA PRODUK ---
  const products = [
    // 1. KATEGORI JUICE (Harga 8.000)
    { id: 1, name: 'Apel', category: 'Juice', price: 8000, image: apelImg },
    { id: 2, name: 'Belimbing', category: 'Juice', price: 8000, image: belimbingImg },
    { id: 3, name: 'Jagung', category: 'Juice', price: 8000, image: jagungImg },
    { id: 4, name: 'Jeruk', category: 'Juice', price: 8000, image: jerukImg },
    { id: 5, name: 'Jambu', category: 'Juice', price: 8000, image: jambuImg },
    { id: 6, name: 'Mangga', category: 'Juice', price: 8000, image: manggaImg },
    { id: 7, name: 'Melon', category: 'Juice', price: 8000, image: melonImg },
    { id: 8, name: 'Naga', category: 'Juice', price: 8000, image: nagaImg },
    { id: 9, name: 'Nenas', category: 'Juice', price: 8000, image: nanasImg },
    { id: 10, name: 'Pokat', category: 'Juice', price: 8000, image: pokatImg },
    { id: 11, name: 'Semangka', category: 'Juice', price: 8000, image: semangkaImg },
    { id: 12, name: 'Sirsak', category: 'Juice', price: 8000, image: sirsakImg },
    { id: 13, name: 'Terong Belanda', category: 'Juice', price: 8000, image: terongBelandaImg },
    { id: 14, name: 'Timun', category: 'Juice', price: 8000, image: timunImg },

    // 2. KATEGORI JUICE + ICE CREAM (Harga 11.000)
    { id: 101, name: 'Apel Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: apelImg },
    { id: 102, name: 'Belimbing Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: belimbingImg },
    { id: 103, name: 'Jagung Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: jagungImg },
    { id: 104, name: 'Jeruk Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: jerukImg },
    { id: 105, name: 'Jambu Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: jambuImg },
    { id: 106, name: 'Mangga Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: manggaImg },
    { id: 107, name: 'Melon Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: melonImg },
    { id: 108, name: 'Naga Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: nagaImg },
    { id: 109, name: 'Nenas Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: nanasImg },
    { id: 110, name: 'Pokat Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: pokatImg },
    { id: 111, name: 'Semangka Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: semangkaImg },
    { id: 112, name: 'Sirsak Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: sirsakImg },
    { id: 113, name: 'Terong Bld Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: terongBelandaImg },
    { id: 114, name: 'Timun Ice Cream', category: 'Juice + Ice Cream', price: 11000, image: timunImg },

    // 3. KATEGORI ICE CREAM (Item Terpisah Sesuai Harga)
    // Harga 9.000
    { id: 201, name: 'Vanilla Ice Cream 9', category: 'Ice Cream', price: 9000, image: icVanillaImg },
    { id: 202, name: 'Cokelat Ice Cream 9', category: 'Ice Cream', price: 9000, image: icCokelatImg },
    { id: 203, name: 'Strawberry Ice Cream 9', category: 'Ice Cream', price: 9000, image: icStrawberryImg },
    { id: 204, name: 'Mix Ice Cream 9', category: 'Ice Cream', price: 9000, image: icMixImg },
    
    // Harga 12.000
    { id: 205, name: 'Vanilla Ice Cream 12', category: 'Ice Cream', price: 12000, image: icVanillaImg },
    { id: 206, name: 'Cokelat Ice Cream 12', category: 'Ice Cream', price: 12000, image: icCokelatImg },
    { id: 207, name: 'Strawberry Ice Cream 12', category: 'Ice Cream', price: 12000, image: icStrawberryImg },
    { id: 208, name: 'Mix Ice Cream 12', category: 'Ice Cream', price: 12000, image: icMixImg },
    
    // Harga 15.000
    { id: 209, name: 'Vanilla Ice Cream 15', category: 'Ice Cream', price: 15000, image: icVanillaImg },
    { id: 210, name: 'Cokelat Ice Cream 15', category: 'Ice Cream', price: 15000, image: icCokelatImg },
    { id: 211, name: 'Strawberry Ice Cream 15', category: 'Ice Cream', price: 15000, image: icStrawberryImg },
    { id: 212, name: 'Mix Ice Cream 15', category: 'Ice Cream', price: 15000, image: icMixImg },
  ];

  // --- LOGIKA FILTER ---
  const filteredProducts = products.filter(p => p.category === selectedCategory);

  // --- LOGIKA TAMBAH KE KERANJANG ---
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    sidebar: { width: '260px', backgroundColor: '#154784', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px', position: 'fixed', height: '100vh', zIndex: 10 },
    logoSection: { display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '12px' },
    menuSectionTitle: { fontSize: '11px', color: '#a0c4eb', marginTop: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '5px' },
    menuItem: { padding: '8px 12px', marginBottom: '2px', borderRadius: '6px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', transition: '0.2s', textDecoration: 'none' },
    activeMenu: { backgroundColor: '#427dfc', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontWeight: '600' },
    divider: { borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 50px', backgroundColor: 'white', minHeight: '100vh', position: 'relative' },
    header: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px', gap: '15px' },
    
    // Dropdown Style
    menuContainer: { position: 'absolute', top: '30px', left: '50px', zIndex: 5 },
    menuButton: { backgroundColor: '#154784', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    dropdown: { position: 'absolute', top: '105%', left: 0, backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden', minWidth: '160px', display: isDropdownOpen ? 'block' : 'none', border: '1px solid #eee' },
    dropdownItem: (isActive) => ({
        padding: '10px 15px', fontSize: '13px', cursor: 'pointer', 
        backgroundColor: isActive ? '#154784' : 'white', 
        color: isActive ? 'white' : '#333',              
        borderBottom: '1px solid #f0f0f0', transition: '0.2s'
    }),

    // Grid Style
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '40px 25px', marginTop: '60px', paddingBottom: '100px', alignItems: 'start' },
    
    // Style Kartu Produk
    card: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer' },
    imageCircle: { width: '130px', height: '130px', borderRadius: '50%', backgroundColor: '#eee', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
    productImg: { width: '100%', height: '100%', objectFit: 'cover' },
    productName: { fontSize: '13px', fontWeight: '600', color: '#333', marginTop: '5px' },

    // Floating Bottom Bar
    bottomBarContainer: { 
        position: 'fixed', bottom: '30px', 
        left: 'calc(50% + 130px)', transform: 'translateX(-50%)', zIndex: 100 
    },
    bottomBar: {
        backgroundColor: '#154784', color: 'white', padding: '15px 50px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 8px 20px rgba(21, 71, 132, 0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '300px'
    }
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <img src={logoImg} alt="Logo" style={{ width: '35px', borderRadius: '5px' }} />
          <h4 className="m-0 fw-bold" style={{ fontSize: '18px' }}>Kasirku</h4>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.menuItem} onClick={() => navigate('/absensi')}><FaCalendarCheck size={16} /> <span>Absensi</span></div>
        {/* --- MENU BARU: PREDIKSI STOK --- */}
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Fitur Cerdas</div>
        
        <div style={styles.menuItem} onClick={() => navigate('/prediksi')}>
        <FaChartLine size={14} /> <span>Prediksi Stok</span>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Karyawan</div>
        <div style={styles.menuItem} onClick={() => navigate('/kelola-karyawan')}><FaUserFriends size={14} /> <span>Kelola Karyawan</span></div>
        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Barang</div>
        <div style={styles.menuItem} onClick={() => navigate('/kelola-produk')}><FaBox size={14} /> <span>Kelola Produk</span></div>
        
        <div style={{ ...styles.menuItem, ...styles.activeMenu }} onClick={() => navigate('/transaksi')}>
            <FaExchangeAlt size={14} /> <span>Transaksi</span>
        </div>

        <div style={styles.divider}></div>
        <div style={styles.menuSectionTitle}>Laporan</div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-harian')}>
            <FaFileAlt size={14} /> <span>Rekap Harian</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-bulanan')}>
            <FaFileAlt size={14} /> <span>Rekap Bulanan</span>
        </div>
        <div style={styles.menuItem} onClick={() => navigate('/rekap-kas')}>
            <FaFileAlt size={14} /> <span>Rekap Kas</span>
        </div>
        <div style={{ marginTop: 'auto', cursor: 'pointer', ...styles.menuItem }} onClick={handleLogout}><FaSignOutAlt /> <span>Keluar</span></div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <span style={{ fontWeight: '600', fontSize: '15px' }}>Bima</span>
          <div onClick={() => navigate('/profile')} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
             <span style={{ fontSize: '14px' }}>👤</span>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div style={styles.menuContainer}>
            <button style={styles.menuButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                Menu <FaChevronDown size={10} />
            </button>
            {isDropdownOpen && (
                <div style={styles.dropdown}>
                    <div style={styles.dropdownItem(selectedCategory === 'Juice')} onClick={() => { setSelectedCategory('Juice'); setIsDropdownOpen(false); }}>
                        Juice
                    </div>
                    <div style={styles.dropdownItem(selectedCategory === 'Juice + Ice Cream')} onClick={() => { setSelectedCategory('Juice + Ice Cream'); setIsDropdownOpen(false); }}>
                        Juice + Ice Cream
                    </div>
                    <div style={styles.dropdownItem(selectedCategory === 'Ice Cream')} onClick={() => { setSelectedCategory('Ice Cream'); setIsDropdownOpen(false); }}>
                        Ice Cream
                    </div>
                </div>
            )}
        </div>

        {/* GRID PRODUK */}
        <div style={styles.grid}>
            {filteredProducts.map((prod) => (
                <div key={prod.id} style={styles.card} onClick={() => addToCart(prod)}>
                    {/* Gambar Lingkaran */}
                    <div style={styles.imageCircle}>
                        <img src={prod.image} alt={prod.name} style={styles.productImg} />
                    </div>
                    {/* Nama Produk */}
                    <div style={styles.productName}>{prod.name}</div>
                </div>
            ))}
        </div>

        {/* Floating Bottom Bar (Menuju Keranjang) */}
        <div style={styles.bottomBarContainer}>
            <div style={styles.bottomBar} onClick={() => navigate('/keranjang')}>
                {totalItems} Produk = {formatRupiah(totalPrice)}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Transaksi;