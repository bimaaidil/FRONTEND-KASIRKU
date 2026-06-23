// src/services/product_api.js
import axios from 'axios';

// Kembalikan ke rute utama/root (/) sesuai konfigurasi asli Python Flask kamu
const API_URL = 'https://backend-kasirku.vercel.app';

// 1. AMBIL SEMUA DATA PRODUK (GET)
export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    throw error;
  }
};

// 2. HAPUS DATA PRODUK (DELETE)
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    throw error;
  }
};

// 3. TAMBAH DATA PRODUK BARU (POST)
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData);
    return response.data;
  } catch (error) {
    console.error("Gagal menambah produk:", error);
    throw error;
  }
};

// 4. PERBARUI DATA PRODUK (PUT)
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Gagal mengupdate produk:", error);
    throw error;
  }
};