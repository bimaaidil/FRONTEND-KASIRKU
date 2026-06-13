// src/pages/Pembayaran.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';

const Pembayaran = () => {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartData');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
      setTotalPrice(total);
    }
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(num);

  const interpretasiKodeCuaca = (code) => {
    if (code === 0) return "Cerah";
    if (code >= 1 && code <= 3) return "Berawan";
    if (code >= 45 && code <= 48) return "Kabut";
    if (code >= 51) return "Hujan";
    return "Lainnya";
  };

  const handlePaymentMethod = async (method) => {
    if (method === 'Tunai') {
      setIsFetchingWeather(true);
      try {
        const weatherRes = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=0.507&longitude=101.447&current_weather=true"
        );
        const weatherData = await weatherRes.json();
        
        const infoCuaca = {
          suhu: weatherData.current_weather.temperature,
          kondisi: interpretasiKodeCuaca(weatherData.current_weather.weathercode)
        };

        localStorage.setItem('tempWeatherData', JSON.stringify(infoCuaca));
        navigate('/tunai'); 
      } catch (error) {
        print("Gagal mengambil cuaca, lanjut tanpa data cuaca:", error);
        navigate('/tunai');
      } finally {
        setIsFetchingWeather(false);
      }
    } else {
      alert(`Metode ${method} belum tersedia.`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
        {/* Header Bar */}
        <div className="bg-white px-3 px-md-4 py-3 shadow-sm border-bottom d-flex align-items-center">
            <button className="btn btn-link text-dark fw-bold d-flex align-items-center gap-2 p-0 text-decoration-none" onClick={() => navigate('/keranjang')}>
                <FaArrowLeft /> Pembayaran
            </button>
        </div>

        {/* Content Box */}
        <div className="container-fluid py-4 px-2 px-md-4" style={{ maxWidth: '600px' }}>
            <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden mb-3">
                <div className="p-4 text-center border-bottom border-light bg-light-subtle">
                    <div className="text-secondary small fw-medium mb-1.5" style={{ fontSize: '13px' }}>TOTAL TAGIHAN NOTA</div>
                    <h1 className="fw-bold m-0" style={{ color: '#154784', fontSize: '32px' }}>
                      {isFetchingWeather ? "Menyiapkan cuaca..." : formatRupiah(totalPrice)}
                    </h1>
                </div>

                <div className="p-4 bg-white">
                    <div className="text-dark fw-bold small mb-3 text-uppercase" style={{ letterSpacing: '0.5px' }}>Pilih Metode Pembayaran</div>
                    
                    <div 
                      className="d-flex justify-content-between align-items-center py-3 border-bottom border-light-subtle" 
                      style={{ 
                        cursor: isFetchingWeather ? 'default' : 'pointer', 
                        opacity: isFetchingWeather ? 0.6 : 1,
                        transition: '0.2s'
                      }}
                      onClick={() => !isFetchingWeather && handlePaymentMethod('Tunai')}
                      onMouseOver={(e) => !isFetchingWeather && (e.currentTarget.style.paddingLeft = '5px')}
                      onMouseOut={(e) => !isFetchingWeather && (e.currentTarget.style.paddingLeft = '0px')}
                    >
                        <span className="fw-semibold text-dark" style={{ fontSize: '15px' }}>
                          {isFetchingWeather ? "Sedang Mengunci Variabel Cuaca..." : "💵 Pembayaran Tunai"}
                        </span>
                        <FaChevronRight className="text-muted" size={12} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Pembayaran;