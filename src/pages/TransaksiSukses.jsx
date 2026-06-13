// src/pages/TransaksiSukses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const TransaksiSukses = () => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const savedTransaction = localStorage.getItem('lastTransaction');
    
    if (savedTransaction) {
      setTransaction(JSON.parse(savedTransaction));
    } else {
      navigate('/transaksi');
    }
  }, [navigate]);

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString); 
    
    const options = { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    };
    
    return date.toLocaleDateString('id-ID', options).replace('pukul', ','); 
  };

  const handleNewTransaction = () => {
    localStorage.removeItem('lastTransaction'); 
    navigate('/transaksi'); 
  };

  const handlePrint = () => {
    window.print(); 
  };

  if (!transaction) return null;

  return (
    <div className="d-flex align-items-center justify-content-center bg-light px-3" style={{ minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
        <div className="card border-0 shadow-sm p-4 p-md-5 bg-white rounded-4 w-100 text-center" style={{ maxWidth: '460px' }}>
            
            {/* Ikon Sukses */}
            <div className="mb-3 text-success">
                <FaCheckCircle style={{ fontSize: '74px', color: '#2ecc71' }} />
            </div>

            <h3 className="fw-bold text-dark m-0" style={{ fontSize: '22px' }}>Transaksi Berhasil</h3>
            <p className="text-muted small fw-medium mt-1 mb-4 font-monospace">{formatDate(transaction.date)}</p>

            {/* Rincian Resi Struk Belanja */}
            <div className="bg-light p-3 rounded-3 mb-4">
                <div className="d-flex justify-content-between small mb-2.5">
                    <span className="text-secondary fw-medium">Metode Bayar</span>
                    <span className="fw-bold text-dark">Tunai (Cash)</span>
                </div>
                <div className="d-flex justify-content-between small mb-2.5">
                    <span className="text-secondary fw-medium">Total Tagihan</span>
                    <span className="fw-bold text-primary">{formatRupiah(transaction.totalPrice)}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2.5">
                    <span className="text-secondary fw-medium">Uang Diterima</span>
                    <span className="fw-bold text-dark font-monospace">{formatRupiah(transaction.receivedAmount)}</span>
                </div>
                <div className="d-flex justify-content-between small border-top pt-2 mt-2">
                    <span className="text-secondary fw-bold">Kembalian</span>
                    <span className="fw-bold text-success" style={{ fontSize: '15px' }}>{formatRupiah(transaction.change)}</span>
                </div>
            </div>

            {/* Tombol Aksi Kasir */}
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-light border fw-bold py-2.5 rounded-3 text-secondary bg-white shadow-sm" onClick={handlePrint}>
                  Cetak Struk Belanja
              </button>
              <button className="btn btn-primary fw-bold py-2.5 rounded-3 border-0" style={{ backgroundColor: '#154784' }} onClick={handleNewTransaction}>
                  Buka Transaksi Baru
              </button>
            </div>

        </div>
    </div>
  );
};

export default TransaksiSukses;