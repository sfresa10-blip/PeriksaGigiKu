import React, { useState, useEffect } from 'react';
import { Lock, Mail, Stethoscope, RefreshCw, ShieldCheck, UserPlus } from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  signInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: (role: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Admin');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setError('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore, if not create
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: 'Admin', // Default role for Google login
          createdAt: new Date().toISOString()
        });
      }
      
      onLogin(userDoc.exists() ? userDoc.data().role : 'Admin');
    } catch (err: any) {
      setError('Gagal masuk dengan Google. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Silakan masukkan email Anda terlebih dahulu.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      setError('Gagal mengirim email reset. Pastikan email terdaftar.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput !== captchaCode) {
      setError('Kode CAPTCHA tidak sesuai. Silakan coba lagi.');
      generateCaptcha();
      return;
    }
    
    setIsLoggingIn(true);
    setError('');
    
    try {
      if (isRegistering) {
        // Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: fullName });
        
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: fullName,
          role: role,
          createdAt: new Date().toISOString()
        });
        
        onLogin(role);
      } else {
        // Login existing user
        try {
          await signInWithEmailAndPassword(auth, email, password);
          onLogin(role);
        } catch (loginErr: any) {
          if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/wrong-password' || loginErr.code === 'auth/invalid-credential') {
            setError('Email atau password salah.');
          } else if (loginErr.code === 'auth/operation-not-allowed' || loginErr.code === 'auth/admin-restricted-operation') {
            setError('Fitur Login Email belum diaktifkan di Firebase Console. Gunakan mode demo atau aktifkan di console.');
            // Fallback for demo: allow login to UI even if Firebase auth fails
            console.warn('Firebase Auth restricted. Proceeding with UI-only login for demo.');
            onLogin(role);
          } else {
            setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
          }
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan masuk.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah (minimal 6 karakter).');
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        setError('Pendaftaran akun baru dibatasi. Silakan aktifkan "Email/Password" di Firebase Console > Authentication.');
      } else {
        setError('Terjadi kesalahan. Silakan periksa koneksi internet Anda.');
        console.error('Auth error:', err);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-baby-pink flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-primary-pink/10 border border-white p-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-pink rounded-[2rem] text-white mb-6 shadow-xl shadow-primary-pink/30 animate-bounce-slow">
            <Stethoscope size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">PeriksaGigiKu</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            {isRegistering ? 'Registrasi Akun Baru' : 'Sistem Asuhan Kesehatan Gigi'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-pink" size={18} />
                <input 
                  type="text" 
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="Nama Lengkap Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-pink" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="admin@gigikusehat.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-pink" size={18} />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isRegistering && (
              <div className="flex justify-end mt-2">
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] font-black text-primary-pink uppercase tracking-widest hover:underline"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Role Akses</label>
            <select 
              className="w-full px-5 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Operator">Operator</option>
              <option value="Pasien">Pasien</option>
              <option value="Dosen Pembimbing">Dosen Pembimbing</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Verifikasi Keamanan</label>
            <div className="flex gap-3 mb-3">
              <div className="flex-1 bg-white border-2 border-dashed border-soft-blue-dark rounded-2xl flex items-center justify-center font-mono text-xl font-black tracking-[0.5em] text-primary-blue select-none py-3 shadow-inner">
                {captchaCode}
              </div>
              <button 
                type="button"
                onClick={generateCaptcha}
                className="w-14 h-14 flex items-center justify-center bg-white border border-soft-blue-dark rounded-2xl text-slate-400 hover:text-primary-pink hover:border-primary-pink transition-all shadow-sm"
                title="Refresh CAPTCHA"
              >
                <RefreshCw size={24} />
              </button>
            </div>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-pink" size={18} />
              <input 
                type="text" 
                required
                className="w-full pl-12 pr-4 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="Masukkan kode di atas"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
            </div>
            {error && (
              <p className="mt-3 text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center gap-2 px-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                {error}
              </p>
            )}
            {resetSent && (
              <p className="mt-3 text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2 px-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Email reset password telah dikirim!
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoggingIn}
            className={cn(
              "w-full bg-primary-pink text-white py-4 rounded-2xl font-black shadow-xl shadow-primary-pink/20 hover:bg-pink-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest",
              isLoggingIn && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoggingIn && <RefreshCw className="animate-spin" size={20} />}
            {isLoggingIn ? 'Memproses...' : (isRegistering ? 'Daftar Sekarang' : 'Masuk ke Sistem')}
          </button>

          {!isRegistering && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-white px-4 text-slate-300">Atau masuk dengan</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border-2 border-soft-blue text-slate-700 py-4 rounded-2xl font-black hover:bg-soft-blue transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Google
              </button>

              <button 
                type="button"
                onClick={() => onLogin('Admin')}
                className="w-full bg-soft-blue text-primary-blue py-4 rounded-2xl font-black hover:bg-primary-blue hover:text-white transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest shadow-sm mt-4"
              >
                Masuk Mode Demo
              </button>
            </>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-slate-400">
            {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="ml-2 text-primary-pink font-black hover:underline"
            >
              {isRegistering ? 'Masuk di sini' : 'Daftar di sini'}
            </button>
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            &copy; 2024 PeriksaGigiKu • WHO & Kemenkes Standard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
