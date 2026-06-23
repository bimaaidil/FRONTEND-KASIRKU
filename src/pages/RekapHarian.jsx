// src/pages/RekapHarian.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Loader } from 'lucide-react';

// --- IMPORT API TRANSAKSI CLOUD ---
import { getTransaksiLogs } from '../services/transaksi_api';

const RekapHarian = () => {
  const [selectedDay, setSelectedDay] = useState(''); 
  const [showReport, setShowReport] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMonthName, setCurrentMonthName] = useState('');
  const [currentMonthNumeric, setCurrentMonthNumeric] = useState('');

  // Otomatis deteksi bulan sekarang saat halaman dimuat
  useEffect(() => {
    const date = new Date();
    // Mengambil nama bulan (ex: "Juni")
    const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date);
    // Mengambil format angka bulan (ex: "06")
    const monthNumeric = String(date.getMonth() + 1).padStart(2, '0');
    
    setCurrentMonthName(monthName);
    setCurrentMonthNumeric(monthNumeric);
  }, []);

  // Fungsi helper untuk mengonversi format tanggal YYYY-MM-DD menjadi nama hari Indonesia
  const getDayNameFromDate = (dateString) => {
    if (!dateString) return '';
    try {
      const dateObj = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(dateObj);
    } catch (e) {
      return '';
    }
  };

  const handleTampilkan = async () => {
    if (selectedDay === '') {
        alert("Silakan pilih hari terlebih dahulu!");
        return;
    }
    
    setLoading(true);
    setShowReport(false);

    try {
        const allHistory = await getTransaksiLogs();
        
        // Filter dokumen berdasarkan nama hari DAN harus berada di bulan berjalan saat ini
        const filteredTransactions = allHistory.filter(item => {
            if (!item.date) return false;
            
            // 1. Validasi filter Bulan (Memastikan transaksi berasal dari bulan sekarang)
            // Mendukung format ISO "2026-06-23" maupun format teks "23 Juni 2026"
            const isMatchMonth = item.date.includes(currentMonthName) || 
                                 item.date.split('-')[1] === currentMonthNumeric || 
                                 item.date.split('/')[1] === currentMonthNumeric;
            
            if (!isMatchMonth) return false;

            // 2. Validasi filter Hari
            const dayName = getDayNameFromDate(item.date);
            return dayName.toLowerCase() === selectedDay.toLowerCase();
        });
        
        // Bongkar array 'items' bertingkat menjadi baris produk flat
        const flattenedItems = [];
        filteredTransactions.forEach(transaksi => {
            const productItems = Array.isArray(transaksi.items) ? transaksi.items : [];
            
            productItems.forEach(subItem => {
                const qty = Number(subItem.qty || subItem.quantity || 0);
                const price = Number(subItem.price || subItem.harga || 0);
                const rowSubtotal = qty * price;

                flattenedItems.push({
                    id: transaksi.id,
                    date: transaksi.date,
                    product: subItem.name || subItem.nama || subItem.product || 'Produk Tidak Diketahui',
                    qty: qty,
                    price: price,
                    subtotal: rowSubtotal > 0 ? rowSubtotal : (Number(transaksi.subtotal) || 0)
                });
            });
            
            if (productItems.length === 0) {
                flattenedItems.push({
                    id: transaksi.id,
                    date: transaksi.date,
                    product: transaksi.product || 'Transaksi POS',
                    qty: Number(transaksi.qty || 1),
                    price: Number(transaksi.price || transaksi.subtotal || 0),
                    subtotal: Number(transaksi.subtotal || 0)
                });
            }
        });

        setCurrentData(flattenedItems);
        setShowReport(true); 
    } catch (error) {
        alert("Gagal memuat laporan harian dari server cloud.");
    } finally {
        setLoading(false);
    }
  };

  const handleDayChange = (e) => {
      setSelectedDay(e.target.value);
      setShowReport(false); 
  };

  const totalPendapatan = currentData.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(num);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />
      
      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0', maxWidth: '100%', overflowX: 'hidden' }}>
        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '20px' }}>Data Penjualan Harian (Cloud Database)</h2>

        {/* HARIAN INPUT FILTER RESPONSIVE */}
        <div className="d-flex flex-column flex-sm-row gap-2 mb-4 align-items-sm-center">
            <select className="form-select bg-white py-2" style={{ minWidth: '180px' }} value={selectedDay} onChange={handleDayChange} disabled={loading}>
                <option value="">Pilih nama hari...</option>
                {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(day => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
            {/* Input otomatis membaca nama bulan berjalan secara dinamis */}
            <input type="text" value={`Bulan ${currentMonthName}`} readOnly className="form-control bg-light text-center py-2 fw-medium text-secondary" style={{ width: window.innerWidth > 576 ? '160px' : '100%' }} />
            <button className="btn btn-primary fw-semibold py-2 px-4 rounded-3 text-nowrap w-100 w-sm-auto d-flex align-items-center justify-content-center gap-2" onClick={handleTampilkan} disabled={loading}>
                {loading ? 'Memuat Data...' : 'Tampilkan Laporan'}
            </button>
        </div>

        {/* DATAGRID TABLE RESPONSIVE */}
        <div className="card border-0 shadow-sm p-3 p-md-4 bg-white rounded-3" style={{ minHeight: '250px' }}>
          <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="table align-middle m-0" style={{ fontSize: '14px', width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr className="text-secondary small text-uppercase">
                        <th style={{ width: '60px', paddingBottom: '1rem' }} className="border-0">No</th>
                        <th style={{ width: '130px', paddingBottom: '1rem' }} className="border-0">Tanggal Transaksi</th>
                        <th style={{ width: '250px', paddingBottom: '1rem' }} className="border-0">Produk</th>
                        <th style={{ width: '90px', paddingBottom: '1rem' }} className="border-0 text-center">Jumlah</th>
                        <th style={{ width: '140px', paddingBottom: '1rem' }} className="border-0 text-center">Harga</th>
                        <th style={{ width: '150px', paddingBottom: '1rem' }} className="border-0 text-center">Sub Total</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center py-5 text-secondary">
                                <Loader className="animate-spin mb-2 mx-auto text-primary" />
                                Menarik Rekap Transaksi Real-time...
                            </td>
                        </tr>
                    ) : showReport && currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <tr key={`${item.id}-${index}`} className="border-top">
                                <td className="py-3 text-muted">{index + 1}</td>
                                <td className="py-3 text-secondary text-truncate">{item.date}</td>
                                <td className="py-3 fw-medium text-dark text-wrap" style={{ wordBreak: 'break-word' }}>{item.product}</td>
                                <td className="py-3 text-center text-dark font-monospace">{item.qty}</td>
                                <td className="py-3 text-center text-secondary font-monospace">Rp {formatRupiah(item.price)}</td>
                                <td className="py-3 text-center text-primary fw-medium font-monospace">Rp {formatRupiah(item.subtotal)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted py-5">
                                {showReport ? `Tidak ada transaksi pada hari ini di bulan ${currentMonthName}.` : "Silakan pilih hari untuk melihat rekap."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>

          {showReport && currentData.length > 0 && !loading && (
              <div className="text-end fw-bold text-dark mt-4" style={{ fontSize: '16px' }}>
                  Total Pendapatan Hari {selectedDay} ({currentMonthName}): <span className="text-primary">Rp {formatRupiah(totalPendapatan)}</span>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RekapHarian;