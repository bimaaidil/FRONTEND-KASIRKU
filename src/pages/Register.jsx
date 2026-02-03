// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import logoImg from '../assets/LogoKasir.jpg'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

// Di dalam Register.jsx

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registrasi Berhasil! Silakan Login."); // Beri notifikasi sukses
    navigate('/');
  } catch (err) {
    console.error(err); // Lihat error lengkap di Console browser (F12)
    
    // Tampilkan pesan error spesifik ke pengguna
    if (err.code === 'auth/email-already-in-use') {
      alert("Email sudah terdaftar! Gunakan email lain.");
    } else if (err.code === 'auth/weak-password') {
      alert("Password terlalu lemah! Minimal 6 karakter.");
    } else if (err.code === 'auth/invalid-email') {
      alert("Format email tidak valid!");
    } else {
      alert("Error: " + err.message); // Tampilkan pesan asli firebase
    }
  }
};

  // --- CONFIG STYLE YANG SAMA ---
  const commonGradient = 'linear-gradient(110deg, #ffffff 50%, #154784 50.1%)';

  const styles = {
    wrapper: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: commonGradient,
      backgroundAttachment: 'fixed', // KUNCI UTAMA
      backgroundSize: 'cover',
    },
    card: {
      maxWidth: '1000px',
      width: '90%',
      borderRadius: '20px',
      border: 'none',
      background: commonGradient,
      backgroundAttachment: 'fixed', // KUNCI UTAMA
      backgroundSize: 'cover',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      overflow: 'hidden'
    },
    input: {
      borderRadius: '8px',
      border: 'none',
      padding: '12px 15px',
      fontSize: '14px',
      color: '#333',
      height: '48px'
    },
    button: {
      backgroundColor: '#427dfc', 
      border: 'none',
      borderRadius: '8px',
      padding: '12px',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(66, 125, 252, 0.4)',
      height: '48px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <div className="row g-0">
          
          {/* BAGIAN KIRI */}
          <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center p-5">
            <div className="text-center">
              <img 
                src={logoImg} 
                alt="Kasirku" 
                className="img-fluid mb-3" 
                style={{ width: '150px' }} 
              />
              <h2 className="fw-bold m-0" style={{ color: '#154784', fontSize: '32px' }}>Kasirku</h2>
            </div>
          </div>

          {/* BAGIAN KANAN */}
          <div className="col-md-6 p-5">
            <div className="ps-md-4 py-3">
              
              <h3 className="d-md-none text-white fw-bold mb-4">Register</h3>

              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label className="text-white fw-bold mb-2 small">Username</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Masukkan Nama Anda" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-white fw-bold mb-2 small">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Masukkan Email Anda" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-white fw-bold mb-2 small">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Masukkan Password Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="rememberPass" style={{ cursor: 'pointer' }} />
                  <label className="form-check-label text-white fw-bold small" htmlFor="rememberPass" style={{ cursor: 'pointer' }}>
                    Ingat Password
                  </label>
                </div>

                <button type="submit" className="btn w-100 text-white" style={styles.button}>
                  Daftar
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