// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase'; 
import logoImg from '../assets/LogoKasir.jpg'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/absensi');
    } catch (err) {
      setError("Login Gagal");
    }
  };

  // --- CONFIG STYLE AGAR GARIS MENYATU ---
  const commonGradient = 'linear-gradient(110deg, #ffffff 50%, #154784 50.1%)';

  const styles = {
    wrapper: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // KUNCI UTAMA: Fixed membuat gradien patuh pada layar, bukan elemen
      background: commonGradient,
      backgroundAttachment: 'fixed', 
      backgroundSize: 'cover',
    },
    card: {
      maxWidth: '1000px', // Sedikit lebih lebar agar proporsional
      width: '90%',
      borderRadius: '20px',
      border: 'none',
      // Card menggunakan background yg SAMA persis & FIXED juga
      background: commonGradient,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      // Shadow tebal agar terlihat melayang dari background yang sama
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
          
          {/* BAGIAN KIRI (LOGO) - Background Putih (Otomatis dari Gradient) */}
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

          {/* BAGIAN KANAN (FORM) - Background Biru (Otomatis dari Gradient) */}
          <div className="col-md-6 p-5">
            {/* Wrapper form diberi padding kiri agar tidak menabrak garis miring */}
            <div className="ps-md-4 py-3"> 
              
              {/* Bagian Input Form */}
              <h3 className="d-md-none text-white fw-bold mb-4">Login</h3> {/* Judul hanya muncul di HP */}
              
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="text-white fw-bold mb-2 small">Username</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Masukkan Nama Anda" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="text-white fw-bold small">Password</label>
                    <a href="#" className="text-decoration-none small" style={{ color: '#a0c4eb' }}>
                      Lupa Password?
                    </a>
                  </div>
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
                  <input className="form-check-input" type="checkbox" id="rememberMe" style={{ cursor: 'pointer' }} />
                  <label className="form-check-label text-white fw-bold small" htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                    Ingat Saya
                  </label>
                </div>

                <button type="submit" className="btn w-100 text-white" style={styles.button}>
                  Login
                </button>
              </form>

              <div className="mt-4 text-center">
                <span className="small text-white-50">Belum Punya Akun? </span>
                <Link to="/register" className="text-decoration-none fw-bold small" style={{ color: '#a0c4eb' }}>
                   Daftar Disini
                </Link>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;