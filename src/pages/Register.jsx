// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import { addEmployee } from '../services/employee_api'; // IMPORT API UNTUK SIMPAN KE DATABASE
import logoImg from '../assets/LogoKasir.jpg'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [noHp, setNoHp] = useState(''); // State Baru
  const [posisi, setPosisi] = useState('Kasir'); // Default posisi
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Daftarkan di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Siapkan data lengkap untuk dimasukkan ke Tabel Karyawan (Firestore)
      const employeeData = {
        uid: user.uid,
        nama: username,
        email: email,
        no_hp: noHp,
        posisi: posisi,
        status: 'PENDING', // Kunci utama alur verifikasi kita
        createdAt: new Date().toISOString()
      };

      // 3. Panggil API untuk simpan data ke Firestore agar muncul di tabel Kelola Karyawan
      await addEmployee(employeeData);

      alert("Registrasi Berhasil! Akun Anda sedang menunggu verifikasi Admin.");
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        alert("Email sudah terdaftar!");
      } else if (err.code === 'auth/weak-password') {
        alert("Password minimal 6 karakter.");
      } else {
        alert("Terjadi kesalahan: " + err.message);
      }
    }
  };

  // --- CONFIG STYLE ---
  const commonGradient = 'linear-gradient(110deg, #ffffff 50%, #154784 50.1%)';

  const styles = {
    wrapper: { minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: commonGradient, backgroundAttachment: 'fixed', backgroundSize: 'cover' },
    card: { maxWidth: '1000px', width: '90%', borderRadius: '20px', border: 'none', background: commonGradient, backgroundAttachment: 'fixed', backgroundSize: 'cover', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' },
    input: { borderRadius: '8px', border: 'none', padding: '12px 15px', fontSize: '14px', color: '#333', height: '48px' },
    button: { backgroundColor: '#427dfc', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '600', boxShadow: '0 4px 15px rgba(66, 125, 252, 0.4)', height: '48px' }
  };

  return (
    <div style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <div className="row g-0">
          
          {/* BAGIAN KIRI */}
          <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center p-5">
            <div className="text-center">
              <img src={logoImg} alt="Kasirku" className="img-fluid mb-3" style={{ width: '150px' }} />
              <h2 className="fw-bold m-0" style={{ color: '#154784', fontSize: '32px' }}>Kasirku</h2>
              <p className="text-muted small mt-2">Manajemen Transaksi & Prediksi Cerdas</p>
            </div>
          </div>

          {/* BAGIAN KANAN */}
          <div className="col-md-6 p-5">
            <div className="ps-md-4 py-3">
              <h3 className="d-md-none text-white fw-bold mb-4">Register</h3>

              <form onSubmit={handleRegister}>
                {/* Username */}
                <div className="mb-3">
                  <label className="text-white fw-bold mb-1 small">Nama Lengkap</label>
                  <input type="text" className="form-control" placeholder="Nama Lengkap" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="text-white fw-bold mb-1 small">Email</label>
                  <input type="email" className="form-control" placeholder="Email Aktif" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
                </div>

                {/* No HP */}
                <div className="mb-3">
                  <label className="text-white fw-bold mb-1 small">No. Telepon</label>
                  <input type="text" className="form-control" placeholder="Contoh: 0812..." value={noHp} onChange={(e) => setNoHp(e.target.value)} style={styles.input} required />
                </div>

                {/* Posisi (Select) */}
                <div className="mb-3">
                  <label className="text-white fw-bold mb-1 small">Posisi Karyawan</label>
                  <select className="form-control" value={posisi} onChange={(e) => setPosisi(e.target.value)} style={styles.input}>
                    <option value="Kasir">Kasir</option>
                    <option value="Admin">Admin (Pemilik)</option>
                  </select>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="text-white fw-bold mb-1 small">Password</label>
                  <input type="password" className="form-control" placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                </div>

                <button type="submit" className="btn w-100 text-white" style={styles.button}>
                  Daftar Sekarang
                </button>
              </form>

              <div className="mt-4 text-center">
                <span className="small text-white-50">Sudah Punya Akun? </span>
                <Link to="/" className="text-decoration-none fw-bold small" style={{ color: '#a0c4eb' }}>
                    Login
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;