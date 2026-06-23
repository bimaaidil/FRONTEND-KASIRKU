// src/pages/DetailKas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMoneyBillWave, FaArrowUp } from 'react-icons/fa';
import { Loader } from 'lucide-react';

// --- IMPORT API KAS CLOUD ---
import { getKasLogs } from '../services/kas_api';

const DetailKas = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKasLogs = async () => {
      setLoading(true);
      try {
        const data = await getKasLogs();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Gagal load detail kas:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKasLogs();
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
        {/* Header */}
        <div className="bg-white px-3 px-md-4 py-3 shadow-sm border-bottom d-flex align-items-center">
            <button 
              className="btn btn-link text-dark fw-bold d-flex align-items-center gap-2 p-0 text-decoration-none" 
              onClick={() => navigate('/rekap-kas')}
            >
                <FaArrowLeft /> Detail Kas
            </button>
        </div>

        {/* Content List */}
        <div className="container-fluid py-3 px-2 px-md-4" style={{ maxWidth: '800px' }}>
            {loading ? (
                <div className="text-center py-5 text-secondary">
                    <Loader className="animate-spin mb-2 mx-auto text-primary" />
                    Memuat Histori Kas dari Cloud...
                </div>
            ) : transactions.length > 0 ? (
                transactions.map((item, index) => {
                    const isMasuk = item.type === 'Uang Masuk';
                    return (
                        <div key={item.id || index} className="card border-0 shadow-sm rounded-3 mb-3 overflow-hidden">
                            
                            {/* Baris Atas: Icon, Judul, Harga */}
                            <div className="p-3 px-md-4 d-flex justify-content-between align-items-center bg-white">
                                <div className="d-flex align-items-center gap-2">
                                    <div 
                                      className="d-flex align-items-center justify-content-center rounded-3" 
                                      style={{ 
                                        width: '36px', height: '34px', 
                                        border: `1px solid ${isMasuk ? '#2ecc71' : '#e74c3c'}`,
                                        color: isMasuk ? '#2ecc71' : '#e74c3c'
                                      }}
                                    >
                                        {isMasuk ? <FaMoneyBillWave size={14} /> : <FaArrowUp size={14} style={{ transform: 'rotate(180deg)' }} />}
                                    </div>
                                    <span className="fw-bold small md-normal" style={{ color: isMasuk ? '#2ecc71' : '#e74c3c' }}>{item.type}</span>
                                </div>
                                <span className="fw-bold" style={{ color: isMasuk ? '#2ecc71' : '#e74c3c', fontSize: '15px' }}>
                                    {isMasuk ? '+' : '-'}{formatRupiah(item.amount)}
                                </span>
                            </div>

                            {/* Baris Detail: Keterangan Waktu & User */}
                            <div className="p-3 px-md-4 bg-light-subtle border-top border-light" style={{ paddingLeft: window.innerWidth > 576 ? '75px' : '15px' }}>
                                <small className="text-muted fw-bold d-block mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>RINCIAN DATA :</small>
                                <div className="d-flex justify-content-between small mb-1">
                                    <span className="text-secondary">Waktu Transaksi</span>
                                    <span className="fw-semibold text-dark text-end">{item.date} | {item.time}</span>
                                </div>
                                <div className="d-flex justify-content-between small">
                                    <span className="text-secondary">Nama Kasir</span>
                                    <span className="fw-semibold text-dark">{item.user}</span>
                                </div>
                            </div>

                            {/* Baris Catatan */}
                            <div className="p-3 px-md-4 bg-white border-top border-light">
                                <small className="text-muted fw-bold d-block mb-1" style={{ fontSize: '11px' }}>CATATAN :</small>
                                <span className="text-dark small fw-medium d-block">{item.description}</span>
                            </div>

                        </div>
                    );
                })
            ) : (
                <div className="text-center py-5 text-muted small">
                    Belum ada data kas masuk/keluar harian di cloud server.
                </div>
            )}
        </div>
    </div>
  );
};

export default DetailKas;