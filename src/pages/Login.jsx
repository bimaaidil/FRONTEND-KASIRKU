// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase'; 
import { getEmployees } from '../services/employee_api'; 
import logoImg from '../assets/LogoKasir.jpg'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const allEmployees = await getEmployees();
      let currentUserData = null;

      if (Array.isArray(allEmployees)) {
        currentUserData = allEmployees.find(emp => emp.email === user.email);
      } else if (allEmployees && Array.isArray(allEmployees.data)) {
        currentUserData = allEmployees.data.find(emp => emp.email === user.email);
      } else if (allEmployees && Array.isArray(allEmployees.karyawan)) {
        currentUserData = allEmployees.karyawan.find(emp => emp.email === user.email);
      }

      if (currentUserData) {
        if (currentUserData.status !== 'AKTIF') {
          setError("Akun Anda belum aktif. Silakan hubungi Admin untuk verifikasi.");
          setLoading(false);
          return;
        }

        localStorage.setItem('userRole', currentUserData.posisi); 
        localStorage.setItem('userName', currentUserData.nama);

        alert(`Selamat datang, ${currentUserData.nama}!`);
        navigate('/absensi');
      } else {
        setError("Data profil tidak ditemukan di database.");
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Email atau Password salah.");
      } else if (err.code === 'auth/invalid-credential') {
        setError("Kredensial tidak valid.");
      } else {
        setError("Terjadi kesalahan sistem saat memproses profil.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- CONFIG STYLE RESPONSIVE ---
  // Perbaikan: Gradien disesuaikan agar di HP (layar kecil) tidak memotong teks form menjadi kontras gelap-terang
  const styles = {
    wrapper: { 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#154784', // Fallback warna dasar untuk HP
      background: 'linear-gradient(135deg, #154784 0%, #0d2c54 100%)', // Gradien modern yang ramah di HP & Laptop
      padding: '20px'
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
    // Form container menggunakan warna gelap seragam agar teks putih terbaca jelas di HP
    formSection: {
      backgroundColor: '#154784',
      padding: '40px 30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100%'
    },
    input: { 
      borderRadius: '8px', 
      border: '1px solid #e5e7eb', 
      padding: '12px 15px', 
      fontSize: '14px', 
      color: '#333', 
      height: '48px',
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
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <div className="row g-0">
          
          {/* BAGIAN KIRI (LOGO) - Otomatis tersembunyi di HP, muncul di Laptop (md) */}
          <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center p-5" style={{ backgroundColor: '#ffffff' }}>
            <div className="text-center">
              <img src={logoImg} alt="Kasirku" className="img-fluid mb-3" style={{ width: '140px', borderRadius: '15px' }} />
              <h2 className="fw-bold m-0" style={{ color: '#154784', fontSize: '32px' }}>Kasirku</h2>
              <p className="text-muted mt-2">Sistem Kasir & Monitoring Karyawan</p>
            </div>
          </div>

          {/* BAGIAN KANAN (FORM) - col-12 membuatnya melebar penuh dan presisi saat di layar HP */}
          <div className="col-12 col-md-6" style={styles.formSection}>
            <div className="w-100"> 
              <div className="text-center d-md-none mb-4">
                {/* Munculkan logo kecil di HP agar identitas aplikasi tidak hilang */}
                <img src={logoImg} alt="Kasirku" className="img-fluid mb-2" style={{ width: '60px', borderRadius: '10px' }} />
                <h3 className="text-white fw-bold m-0">Kasirku</h3>
              </div>
              
              <h3 className="d-none d-md-block text-white fw-bold mb-4">Login</h3> 
              
              {error && <div className="alert alert-danger py-2 small mb-3" style={{ borderRadius: '8px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none' }}>{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="text-white fw-bold mb-2 small">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="nama@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="text-white fw-bold small">Password</label>
                    <Link to="#" className="text-decoration-none small" style={{ color: '#a0c4eb' }}>
                      Lupa Password?
                    </Link>
                  </div>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="rememberMe" style={{ cursor: 'pointer' }} />
                  <label className="form-check-label text-white fw-bold small" htmlFor="rememberMe" style={{ cursor: 'pointer' }}>
                    Ingat Saya
                  </label>
                </div>

                <button type="submit" className="btn w-100" style={styles.button} disabled={loading}>
                  {loading ? "Memverifikasi..." : "Login Ke Dashboard"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <span className="small style={{ color: '#e5e7eb' }}">Belum Punya Akun? </span>
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