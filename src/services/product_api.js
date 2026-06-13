// src/services/product_api.js
import axios from 'axios';

// Arahkan ke endpoint produk di Python Flask
const API_URL = 'https://backend-kasirku.vercel.app';

// 1. AMBIL SEMUA PRODUK (GET)
export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    throw error;
  }
};

// 2. HAPUS PRODUK (DELETE)
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    throw error;
  }
};

// 3. TAMBAH PRODUK (POST) - Akan dipakai di halaman TambahProduk
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData);
    return response.data;
  } catch (error) {
    console.error("Gagal menambah produk:", error);
    throw error;
  }
};

// 4. UPDATE PRODUK (PUT) - Akan dipakai di halaman EditProduk
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Gagal mengupdate produk:", error);
    throw error;
  }
};