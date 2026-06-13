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
  const [noHp, setNoHp] = useState(''); 
  const [posisi, setPosisi] = useState('Kasir'); 
  
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

  // --- CONFIG STYLE RESPONSIVE ---
  const styles = {
    wrapper: { 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#154784', 
      background: 'linear-gradient(135deg, #154784 0%, #0d2c54 100%)', 
      padding: '20px 10px' // Padding vertikal diperlebar agar form panjang tidak mepet batas layar
    },
    card: { 
      maxWidth: '950px', 
      width: '100%', 
      borderRadius: '20px', 
      border: 'none', 
      backgroundColor: '#ffffff',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)', 
      overflow: 'hidden' 
    },
    formSection: {
      backgroundColor: '#154784',
      padding: '35px 25px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100%'
    },
    input: { 
      borderRadius: '8px', 
      border: '1px solid #e5e7eb', 
      padding: '10px 15px', 
      fontSize: '14px', 
      color: '#333', 
      height: '46px',
      backgroundColor: '#ffffff'
    },
    button: { 
      backgroundColor: '#427dfc', 
      border: 'none', 
      borderRadius: '8px', 
      padding: '12px', 
      fontWeight: '600', 
      boxShadow: '0 4px 15px rgba(66, 125, 252, 0.4)', 
      height: '48px',
      color: 'white',
      cursor: 'pointer',
      marginTop: '15px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <div className="row g-0">
          
          {/* BAGIAN KIRI (LOGO) - Otomatis hilang di HP (d-none), muncul di PC (d-md-flex) */}
          <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center p-5" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-center">
              <img src={logoImg} alt="Kasirku" className="img-fluid mb-3" style={{ width: '140px', borderRadius: '15px' }} />
              <h2 className="fw-bold m-0" style={{ color: '#154784', fontSize: '32px' }}>Kasirku</h2>
              <p className="text-muted mt-2">Manajemen Transaksi & Prediksi Cerdas</p>
            </div>
          </div>

          {/* BAGIAN KANAN (FORM) - col-12 menjamin form melebar penuh & seimbang di HP */}
          <div className="col-12 col-md-6" style={styles.formSection}>
            <div className="w-100">
              
              {/* Logo Tambahan Khusus Tampilan Layar HP */}
              <div className="text-center d-md-none mb-4">
                <img src={logoImg} alt="Kasirku" className="img-fluid mb-2" style={{ width: '60px', borderRadius: '10px' }} />
                <h3 className="text-white fw-bold m-0">Daftar Akun</h3>
              </div>

              <h3 className="d-none d-md-block text-white fw-bold mb-4">Register</h3>

              <form onSubmit={handleRegister}>
                {/* Username */}
                <div className="mb-3">
                  <label className="text-white fw-bold mb-1 small">Nama Lengkap</label>
                  <input type="text" className="form-control" placeholder="Nama Lengkap Anda" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="text-white fw-bold mb-1 small">Email</label>
                  <input type="email" className="form-control" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
                </div>

                {/* No HP */}
                <div className="mb-3">
                  <label className="text-white fw-bold mb-1 small">No. Telepon</label>
                  <input type="text" className="form-control" placeholder="Contoh: 0812XXXXXXXX" value={noHp} onChange={(e) => setNoHp(e.target.value)} style={styles.input} required />
                </div>

                {/* Posisi (Select) */}
                <div className="mb-3">
                  <label className="text-white fw-bold mb-1 small">Posisi Karyawan</label>
                  <select className="form-select" value={posisi} onChange={(e) => setPosisi(e.target.value)} style={styles.input}>
                    <option value="Kasir">Kasir</option>
                    <option value="Admin">Admin (Pemilik)</option>
                  </select>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="text-white fw-bold mb-1 small">Password</label>
                  <input type="password" className="form-control" placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
                </div>

                <button type="submit" className="btn w-100" style={styles.button}>
                  Daftar Sekarang
                </button>
              </form>

              <div className="mt-4 text-center">
                <span className="small" style={{ color: '#e5e7eb' }}>Sudah Punya Akun? </span>
                <Link to="/" className="text-decoration-none fw-bold small" style={{ color: '#a0c4eb' }}>
                    Login Disini
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