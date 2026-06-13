// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase'; 
import { getEmployees } from '../services/employee_api'; // Ambil data karyawan
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
      // 1. Login ke Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Ambil data profil dari database untuk cek Role & Status
      const allEmployees = await getEmployees();
      let currentUserData = null;

      // --- PERBAIKAN UTAMA: SISTEM PARSING AMAN UNTUK VERCEL ---
      // Cek jika data langsung berbentuk Array lurus
      if (Array.isArray(allEmployees)) {
        currentUserData = allEmployees.find(emp => emp.email === user.email);
      } 
      // Cek jika berbentuk objek yang membungkus array di dalam key 'data'
      else if (allEmployees && Array.isArray(allEmployees.data)) {
        currentUserData = allEmployees.data.find(emp => emp.email === user.email);
      } 
      // Cek jika berbentuk objek yang membungkus array di dalam key 'karyawan'
      else if (allEmployees && Array.isArray(allEmployees.karyawan)) {
        currentUserData = allEmployees.karyawan.find(emp => emp.email === user.email);
      }

      if (currentUserData) {
        // 3. Cek apakah akun sudah diverifikasi Admin
        if (currentUserData.status !== 'AKTIF') {
          setError("Akun Anda belum aktif. Silakan hubungi Admin untuk verifikasi.");
          setLoading(false);
          return;
        }

        // 4. Simpan Role dan Nama ke localStorage untuk kebutuhan Sidebar & UI
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

  // --- CONFIG STYLE ---
  const commonGradient = 'linear-gradient(110deg, #ffffff 50%, #154784 50.1%)';

  const styles = {
    wrapper: { minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: commonGradient, backgroundAttachment: 'fixed', backgroundSize: 'cover' },
    card: { maxWidth: '1000px', width: '90%', borderRadius: '20px', border: 'none', background: commonGradient, backgroundAttachment: 'fixed', backgroundSize: 'cover', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' },
    input: { borderRadius: '8px', border: 'none', padding: '12px 15px', fontSize: '14px', color: '#333', height: '48px' },
    button: { backgroundColor: '#427dfc', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '600', boxShadow: '0 4px 15px rgba(66, 125, 252, 0.4)', height: '48px', color: 'white', cursor: 'pointer' }
  };

  return (
    <div style={styles.wrapper}>
      <div className="card" style={styles.card}>
        <div className="row g-0">
          
          {/* BAGIAN KIRI (LOGO) */}
          <div className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center p-5">
            <div className="text-center">
              <img src={logoImg} alt="Kasirku" className="img-fluid mb-3" style={{ width: '150px' }} />
              <h2 className="fw-bold m-0" style={{ color: '#154784', fontSize: '32px' }}>Kasirku</h2>
              <p className="text-muted mt-2">Sistem Kasir & Monitoring Karyawan</p>
            </div>
          </div>

          {/* BAGIAN KANAN (FORM) */}
          <div className="col-md-6 p-5">
            <div className="ps-md-4 py-3"> 
              <h3 className="d-md-none text-white fw-bold mb-4">Login</h3> 
              
              {error && <div className="alert alert-danger py-2 small mb-3" style={{ borderRadius: '8px' }}>{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-4">
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

                <div className="mb-4">
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