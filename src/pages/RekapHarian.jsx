// src/pages/RekapHarian.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const RekapHarian = () => {
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState(''); 
  const [showReport, setShowReport] = useState(false);
  const [currentData, setCurrentData] = useState([]);

  const handleTampilkan = () => {
    if (selectedDay === '') {
        alert("Silakan pilih hari terlebih dahulu!");
        return;
    }
    const allHistory = JSON.parse(localStorage.getItem('historyTransaksi')) || [];
    const filtered = allHistory.filter(item => item.day === selectedDay);
    setCurrentData(filtered);
    setShowReport(true); 
  };

  const handleDayChange = (e) => {
      setSelectedDay(e.target.value);
      setShowReport(false); 
  };

  const totalPendapatan = currentData.reduce((acc, curr) => acc + curr.subtotal, 0);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(num);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />
      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0' }}>
        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '20px' }}>Data Penjualan Harian</h2>

        {/* HARIAN INPUT FILTER RESPONSIVE */}
        <div className="d-flex flex-column flex-sm-row gap-2 mb-4 align-items-sm-center">
            <select className="form-select bg-white py-2" style={{ minWidth: '180px' }} value={selectedDay} onChange={handleDayChange}>
                <option value="">Pilih nama hari...</option>
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(day => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
            <input type="text" value="Bulan Sekarang" readOnly className="form-control bg-light text-center py-2" style={{ width: window.innerWidth > 576 ? '140px' : '100%' }} />
            <button className="btn btn-primary fw-semibold py-2 px-4 rounded-3 text-nowrap w-100 w-sm-auto" onClick={handleTampilkan}>Tampilkan Laporan</button>
        </div>

        {/* DATAGRID TABLE RESPONSIVE */}
        <div className="card border-0 shadow-sm p-4 bg-white rounded-3" style={{ minHeight: '250px' }}>
          <div className="table-responsive">
            <table className="table align-middle text-nowrap m-0" style={{ fontSize: '14px' }}>
                <thead>
                    <tr className="text-secondary small text-uppercase">
                        <th className="border-0 pb-3">No</th>
                        <th className="border-0 pb-3">Tanggal Transaksi</th>
                        <th className="border-0 pb-3">Produk</th>
                        <th className="border-0 pb-3 text-center">Jumlah</th>
                        <th className="border-0 pb-3 text-center">Harga</th>
                        <th className="border-0 pb-3 text-center">Sub Total</th>
                    </tr>
                </thead>
                <tbody>
                    {showReport && currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <tr key={item.id} className="border-top">
                                <td className="py-3 text-muted">{index + 1}</td>
                                <td className="py-3 text-secondary">{item.date}</td>
                                <td className="py-3 fw-medium text-dark">{item.product}</td>
                                <td className="py-3 text-center text-dark">{item.qty}</td>
                                <td className="py-3 text-center text-secondary">Rp {formatRupiah(item.price)}</td>
                                <td className="py-3 text-center text-primary fw-medium">Rp {formatRupiah(item.subtotal)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted py-5">
                                {showReport ? "Tidak ada transaksi pada hari ini." : "Silakan pilih hari untuk melihat rekap."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>

          {showReport && currentData.length > 0 && (
              <div className="text-end fw-bold text-dark mt-4" style={{ fontSize: '16px' }}>
                  Total Pendapatan {selectedDay}: <span className="text-primary">Rp {formatRupiah(totalPendapatan)}</span>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RekapHarian;