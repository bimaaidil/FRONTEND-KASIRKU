import { db } from '../config/firebase'; // Sesuaikan dengan config kamu
import { doc, runTransaction, serverTimestamp, collection, addDoc } from "firebase/firestore";

export const simpanStokOpname = async (data) => {
  const { idProduk, namaProduk, stokSistem, stokFisik, keterangan, idPengguna } = data;
  const selisih = stokFisik - stokSistem;

  try {
    await runTransaction(db, async (transaction) => {
      const produkRef = doc(db, "products", idProduk);
      const opnameRef = doc(collection(db, "stok_opname"));

      // 1. Update stok di koleksi products
      transaction.update(produkRef, { stok: stokFisik });

      // 2. Catat riwayat di koleksi stok_opname
      transaction.set(opnameRef, {
        id_produk: idProduk,
        nama_produk: namaProduk,
        stok_sistem: stokSistem,
        stok_fisik: stokFisik,
        selisih: selisih,
        keterangan: keterangan,
        id_pengguna: idPengguna,
        tanggal: serverTimestamp()
      });
    });
    return { success: true };
  } catch (e) {
    console.error("Transaksi Gagal: ", e);
    return { success: false, error: e };
  }
};