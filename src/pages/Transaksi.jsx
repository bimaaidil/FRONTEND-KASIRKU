import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

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
import icStrawberryImg from '../assets/IC Strawberry.jpg';
import icMixImg from '../assets/IC Mix.jpg';

import { FaChevronDown, FaShoppingCart } from 'react-icons/fa';

const Transaksi = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const [selectedCategory, setSelectedCategory] = useState('Juice'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartData');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartData', JSON.stringify(cart));
  }, [cart]);

  const products = [
    // 1. KATEGORI JUICE (Harga Baru: 9.000)
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

    // 2. KATEGORI JUICE + ICE CREAM (Harga Baru: 12.000)
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

    // 3. KATEGORI ICE CREAM (Harga Tetap)
    { id: 201, name: 'Vanilla Ice Cream 9', category: 'Ice Cream', price: 9000, image: icVanillaImg },
    { id: 202, name: 'Cokelat Ice Cream 9', category: 'Ice Cream', price: 9000, image: icCokelatImg },
    { id: 205, name: 'Vanilla Ice Cream 12', category: 'Ice Cream', price: 12000, image: icVanillaImg },
    { id: 209, name: 'Vanilla Ice Cream 15', category: 'Ice Cream', price: 15000, image: icVanillaImg },
    { id: 212, name: 'Mix Ice Cream 15', category: 'Ice Cream', price: 15000, image: icMixImg },
  ];

  const filteredProducts = products.filter(p => p.category === selectedCategory);

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

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: 'white', fontFamily: "'Poppins', sans-serif" },
    mainContent: { marginLeft: '260px', flex: 1, padding: '30px 50px', backgroundColor: 'white', minHeight: '100vh', position: 'relative' },
    header: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px', gap: '15px' },
    menuContainer: { position: 'absolute', top: '30px', left: '50px', zIndex: 5 },
    menuButton: { backgroundColor: '#154784', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    dropdown: { position: 'absolute', top: '110%', left: 0, backgroundColor: 'white', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: '10px', overflow: 'hidden', minWidth: '180px', display: isDropdownOpen ? 'block' : 'none', border: '1px solid #f1f1f1' },
    dropdownItem: (isActive) => ({ padding: '12px 20px', fontSize: '13px', cursor: 'pointer', backgroundColor: isActive ? '#154784' : 'white', color: isActive ? 'white' : '#333', borderBottom: '1px solid #f8f8f8', transition: '0.2s' }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '40px 25px', marginTop: '70px', paddingBottom: '120px', alignItems: 'start' },
    card: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' },
    imageCircle: { width: '130px', height: '130px', borderRadius: '50%', backgroundColor: '#f9fafb', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    productImg: { width: '100%', height: '100%', objectFit: 'cover' },
    productName: { fontSize: '14px', fontWeight: '600', color: '#1f2937', marginTop: '5px' },
    bottomBarContainer: { position: 'fixed', bottom: '30px', left: 'calc(50% + 130px)', transform: 'translateX(-50%)', zIndex: 100 },
    bottomBar: { backgroundColor: '#154784', color: 'white', padding: '18px 60px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(21, 71, 132, 0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '350px', transition: '0.3s' }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <span style={{ fontWeight: '600', fontSize: '15px', color: '#374151' }}>{userName}</span>
          <div onClick={() => navigate('/profile')} style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #e5e7eb' }}>
             <span style={{ fontSize: '16px' }}>👤</span>
          </div>
        </div>

        <div style={styles.menuContainer}>
            <button style={styles.menuButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {selectedCategory} <FaChevronDown size={10} />
            </button>
            {isDropdownOpen && (
                <div style={styles.dropdown}>
                    {['Juice', 'Juice + Ice Cream', 'Ice Cream'].map(cat => (
                        <div key={cat} style={styles.dropdownItem(selectedCategory === cat)} onClick={() => { setSelectedCategory(cat); setIsDropdownOpen(false); }}>
                            {cat}
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div style={styles.grid}>
            {filteredProducts.map((prod) => (
                <div key={prod.id} style={styles.card} onClick={() => addToCart(prod)}>
                    <div style={styles.imageCircle}>
                        <img src={prod.image} alt={prod.name} style={styles.productImg} />
                    </div>
                    <div style={styles.productName}>{prod.name}</div>
                    <div style={{fontSize: '12px', color: '#6b7280'}}>{formatRupiah(prod.price)}</div>
                </div>
            ))}
        </div>

        {totalItems > 0 && (
            <div style={styles.bottomBarContainer}>
                <div style={styles.bottomBar} onClick={() => navigate('/keranjang')}>
                    <FaShoppingCart style={{marginRight: '10px'}} />
                    {totalItems} Produk | {formatRupiah(totalPrice)}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Transaksi;