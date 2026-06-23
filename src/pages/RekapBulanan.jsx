// src/pages/RekapBulanan.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Loader } from 'lucide-react';

// --- IMPORT API TRANSAKSI CLOUD ---
import { getTransaksiLogs } from '../services/transaksi_api';

const RekapBulanan = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [dataBulanan, setDataBulanan] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const handleTampilkan = async () => {
    if (selectedMonth === '') {
        alert("Silakan pilih bulan terlebih dahulu!");
        return;
    }

    setLoading(true);
    setShowReport(false);

    try {
        const allHistory = await getTransaksiLogs();
        
        // 1. Filter dokumen transaksi berdasarkan bulan yang dipilih
        const filteredTransactions = allHistory.filter(item => {
            if (!item.date) return false;
            
            if (item.date.includes(selectedMonth)) {
                return true;
            }

            const monthsMap = {
                'Januari': '-01-', 'Februari': '-02-', 'Maret': '-03-', 'April': '-04-',
                'Mei': '-05-', 'Juni': '-06-', 'Juli': '-07-', 'Agustus': '-08-',
                'September': '-09-', 'Oktober': '-10-', 'November': '-11-', 'Desember': '-12-'
            };
            
            const monthsMapAlt = {
                'Januari': '/01/', 'Februari': '/02/', 'Maret': '/03/', 'April': '/04/',
                'Mei': '/05/', 'Juni': '/06/', 'Juli': '/07/', 'Agustus': '/08-',
                'September': '/09/', 'Oktober': '/10/', 'November': '/11/', 'Desember': '/12/'
            };
            
            const targetNumber = monthsMap[selectedMonth];
            const targetNumberAlt = monthsMapAlt[selectedMonth];
            return item.date.includes(targetNumber) || item.date.includes(targetNumberAlt) || item.date.split('/')[1] === targetNumber.replace(/-/g, '') || item.date.split('-')[1] === targetNumber.replace(/-/g, '');
        });

        // 2. Bongkar array 'items' bertingkat dari Firestore menjadi baris produk yang flat/lurus
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

        setDataBulanan(flattenedItems);
        setShowReport(true);
        setCurrentPage(1); 
    } catch (error) {
        console.error(error);
        alert("Gagal memuat rekap bulanan dari cloud database.");
    } finally {
        setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
      setSelectedMonth(e.target.value);
      setShowReport(false); 
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = showReport ? dataBulanan.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(dataBulanan.length / itemsPerPage);

  const totalPendapatan = dataBulanan.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Poppins', sans-serif" }}>
      <Sidebar />
      
      {/* Container utama dengan max-width 100% dan overflow-hidden agar mencegah scrollbar horizontal liar */}
      <div className="flex-grow-1 p-3 p-md-4" style={{ marginLeft: window.innerWidth > 768 ? '260px' : '0', maxWidth: '100%', overflowX: 'hidden' }}>
        <h2 className="fw-bold text-dark mb-4" style={{ fontSize: '20px' }}>Data Penjualan Bulanan (Cloud Database)</h2>

        {/* INPUT FILTER RESPONSIVE */}
        <div className="d-flex flex-column flex-sm-row gap-2 mb-4 align-items-sm-center">
            <select className="form-select bg-white py-2" style={{ minWidth: '180px' }} value={selectedMonth} onChange={handleMonthChange} disabled={loading}>
                <option value="">Pilih nama bulan...</option>
                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <input type="text" value="2026" readOnly className="form-control bg-light text-center py-2" style={{ width: window.innerWidth > 576 ? '80px' : '100%' }} />
            <button className="btn btn-primary fw-semibold py-2 px-4 rounded-3 text-nowrap w-100 w-sm-auto" onClick={handleTampilkan} disabled={loading}>
                {loading ? 'Memuat Data...' : 'Tampilkan Laporan'}
            </button>
        </div>

        {/* TABLE CARD CONTAINER */}
        <div className="card border-0 shadow-sm p-3 p-md-4 bg-white rounded-3" style={{ minHeight: '450px' }}>
          <div className="table-responsive flex-grow-1" style={{ width: '100%', overflowX: 'auto' }}>
            {/* Mengatur layout tabel ke fixed dan memberikan batas persentase kolom agar seimbang di layar laptop */}
            <table className="table align-middle m-0" style={{ fontSize: '14px', width: '100%', tableLayout: 'fixed' }}>
                <thead>
                    <tr className="text-secondary small text-uppercase">
                        <th style={{ width: '60px', paddingBottom: '1rem' }} className="border-0">No</th>
                        <th style={{ width: '130px', paddingBottom: '1rem' }} className="border-0">Tanggal</th>
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
                                Menghitung Rekap Laporan Bulanan...
                            </td>
                        </tr>
                    ) : showReport && currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <tr key={`${item.id}-${index}`} className="border-top">
                                <td className="py-3 text-muted">{indexOfFirstItem + index + 1}</td>
                                <td className="py-3 text-secondary text-truncate">{item.date}</td>
                                <td className="py-3 fw-medium text-dark text-wrap" style={{ wordBreak: 'break-word' }}>{item.product}</td>
                                <td className="py-3 text-center text-dark font-monospace">{item.qty}</td>
                                <td className="py-3 text-center text-secondary font-monospace">{formatRupiah(item.price)}</td>
                                <td className="py-3 text-center text-primary fw-medium font-monospace">{formatRupiah(item.subtotal)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted py-5">
                                {showReport ? "Tidak ada data penjualan pada bulan ini." : "Silakan pilih bulan dan klik Tampilkan Laporan."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>

          {showReport && dataBulanan.length > 0 && !loading && (
              <div className="mt-4">
                  <div className="text-end fw-bold text-dark mb-3" style={{ fontSize: '16px' }}>
                      Total Pendapatan {selectedMonth}: <span className="text-primary">{formatRupiah(totalPendapatan)}</span>
                  </div>

                  {/* Navigasi Paginasi yang Rapi & Otomatis Membungkus Jika Terlalu Banyak Angka */}
                  {totalPages > 1 && (
                      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-end gap-1 mt-2">
                          <button className="btn btn-light btn-sm border d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                              <FaChevronLeft size={9} />
                          </button>
                          
                          {Array.from({ length: totalPages }, (_, i) => (
                              <button 
                                  key={i + 1} 
                                  className={`btn btn-sm d-flex align-items-center justify-content-center fw-medium ${currentPage === i + 1 ? 'btn-primary' : 'btn-light border'}`}
                                  style={{ width: '32px', height: '32px', fontSize: '12px' }}
                                  onClick={() => setCurrentPage(i + 1)}
                              >
                                  {i + 1}
                              </button>
                          ))}

                          <button className="btn btn-light btn-sm border d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                              <FaChevronRight size={9} />
                          </button>
                      </div>
                  )}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RekapBulanan;